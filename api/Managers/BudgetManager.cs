using api.Dto;
using api.Helpers;
using api.Models;
using api.Repositories;
using AutoMapper;

namespace api.Managers;

/// <summary>
/// Hanterar logik för budget
/// </summary>
public class BudgetManager(BudgetRepository budgetRepository, OrderRepository orderRepository, IMapper mapper)
{
    private readonly BudgetRepository budgetRepository = budgetRepository;
    private readonly OrderRepository orderRepository = orderRepository;
    private readonly IMapper mapper = mapper;

    /// <summary>
    /// Hämtar budget för ett specifikt varuhus
    /// </summary>
    /// <param name="storeId">ID för varuhuset</param>
    /// <returns>Lista med alla operatörsbudgetar för varuhuset</returns>
    /// <exception cref="InvalidOperationException">Kastas om ingen budget hittas för det angivna varuhuset och perioden.</exception>
    public async Task<List<BudgetDto>> GetBudget(int storeId)
    {
        int year = DateTimeHelper.GetSwedishTime().Year;
        int month = DateTimeHelper.GetSwedishTime().Month;
        int day = DateTimeHelper.GetSwedishTime().Day;
        int daysInMonth = DateTime.DaysInMonth(year, month);

        DateTime startOfMonth = new DateTime(year, month, 1);
        DateTime endOfMonth = startOfMonth.AddMonths(1).AddSeconds(-1);
        
        List<Budget> budgets = await budgetRepository.GetBudgetFromDatabase(storeId, year, month);
        if (!budgets.Any()) throw new InvalidOperationException("Tekniskt fel: Ingen budget hittades i systemet. Kontakta support om problemet kvarstår.");

        Dictionary<int, int> abonnemangSoldPerOperator = await orderRepository.GetAbonnemangSoldPerOperatorFromDatabase(startOfMonth, endOfMonth, storeId);
        List<BudgetDto> budgetDtos = mapper.Map<List<BudgetDto>>(budgets);

        foreach (BudgetDto budget in budgetDtos)
        {
            int sold = abonnemangSoldPerOperator.TryGetValue(budget.OperatorId, out int value) ? value : 0;
            int progress = CalculateProgress(sold, budget.OperatorBudget);
            int trending = CalculateTrending(sold, budget.OperatorBudget, day, daysInMonth);

            budget.AbonnemangSold = sold;
            budget.Progress = progress;
            budget.Trending = trending;
        }

        return budgetDtos;
    }

    /// <summary>
    /// Beräknar progress som procentandel av budgeten
    /// </summary>
    private int CalculateProgress(int sold, int operatorBudget)
    {
        return operatorBudget > 0 ? (int)Math.Round((double)sold / operatorBudget * 100) : 0;
    }

    /// <summary>
    /// Beräknar trending som en prognos baserat på genomsnittlig försäljning per dag
    /// </summary>
    private int CalculateTrending(int sold, int operatorBudget, int day, int daysInMonth)
    {
        double averagePerDay = (double)sold / day;
        double trendingAbonnemang = averagePerDay * daysInMonth;
        return operatorBudget > 0 ? (int)Math.Round(trendingAbonnemang / operatorBudget * 100) : 0;
    }

    /// <summary>
    /// Uppdaterar budget för en specifik operatör i ett varuhus för en viss period
    /// </summary>
    /// <param name="budgetDto">Budget att uppdatera</param>
    /// <returns>Den uppdaterade budgeten</returns>
    /// <exception cref="ArgumentNullException">Kastas om budgetdata saknas.</exception>
    /// <exception cref="ArgumentOutOfRangeException">Kastas om månaden är ogiltig eller budgeten är negativ.</exception>
    /// <exception cref="InvalidOperationException">Kastas om budgeten inte finns.</exception>
    public async Task<Budget> UpdateBudget(BudgetDto budgetDto)
    {
        if (budgetDto is null) throw new ArgumentNullException(nameof(budgetDto), "En ny budget måste anges.");
        if (budgetDto.Month < 1 || budgetDto.Month > 12) throw new ArgumentOutOfRangeException(nameof(budgetDto.Month), "Månaden som angavs vid uppdatering av budget är inte en giltig månad.");
        if (budgetDto.OperatorBudget < 0) throw new ArgumentOutOfRangeException(nameof(budgetDto.OperatorBudget), "Budgeten som angavs vid uppdatering av budget är inte en giltig budget.");

        Budget? budget = await budgetRepository.GetBudgetToUpdateFromDatabase(budgetDto.OperatorId, budgetDto.StoreId, budgetDto.Year, budgetDto.Month) ?? throw new InvalidOperationException("Tekniskt fel: Det gick inte att justera budgeten. Kontakta support om problemet kvarstår.");
        if (budget.OperatorBudget != budgetDto.OperatorBudget)
        {
            budget.OperatorBudget = budgetDto.OperatorBudget;
            await budgetRepository.UpdateBudgetInDatabase(budget);
        }

        return budget;
    }
}
