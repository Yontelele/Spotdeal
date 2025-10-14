using api.Context;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories;

/// <summary>
/// Databas operationer för budget
/// </summary>
public class BudgetRepository(AbonnemangDbContext dbContext)
{
    private readonly AbonnemangDbContext dbContext = dbContext;

    /// <summary>
    /// Hämtar budget för ett specifikt varuhus och period
    /// </summary>
    /// <param name="storeId">ID för varuhuset</param>
    /// <param name="year">År för budgeten</param>
    /// <param name="month">Månad för budgeten</param>
    /// <returns>Lista med alla operatörsbudgetar för varuhuset</returns>
    public async Task<List<Budget>> GetBudgetFromDatabase(int storeId, int year, int month)
    {
        return await dbContext.Budgets
            .Include(b => b.Store)
            .Include(b => b.Operator)
            .Where(b => b.StoreId == storeId && b.Year == year && b.Month == month)
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Hämtar en specifik budget för uppdatering
    /// </summary>
    /// <param name="operatorId">ID för operatören</param>
    /// <param name="storeId">ID för varuhuset</param>
    /// <param name="year">År för budgeten</param>
    /// <param name="month">Månad för budgeten</param>
    /// <returns>Budgeten om den finns, annars null</returns>
    public async Task<Budget?> GetBudgetToUpdateFromDatabase(int operatorId, int storeId, int year, int month)
    {
        return await dbContext.Budgets
            .Include(b => b.Store)
            .Include(b => b.Operator)
            .FirstOrDefaultAsync(b =>
                b.StoreId == storeId &&
                b.Year == year &&
                b.Month == month &&
                b.OperatorId == operatorId);
    }

    /// <summary>
    /// Uppdaterar budget med nya värden i databasen
    /// </summary>
    /// <param name="budget">Budget som ska uppdateras</param>
    public async Task UpdateBudgetInDatabase(Budget budget)
    {
        dbContext.Budgets.Update(budget);
        await dbContext.SaveChangesAsync();
    }
}
