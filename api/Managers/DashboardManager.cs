using api.Dto;
using api.Enums;
using api.Helpers;
using api.Models;
using api.Repositories;
using AutoMapper;

namespace api.Managers;

/// <summary>
/// Hanterar logik för dashboard
/// </summary>
public class DashboardManager(OrderRepository orderRepository, BudgetRepository budgetRepository, UserRepository userRepository, IMapper mapper)
{
    private readonly BudgetRepository budgetRepository = budgetRepository;
    private readonly OrderRepository orderRepository = orderRepository;
    private readonly UserRepository userRepository = userRepository;
    private readonly IMapper mapper = mapper;

    /// <summary>
    /// Hämtar all dashboard data för nuvarande månad
    /// </summary>
    /// <param name="storeId">ID för varuhuset</param>
    /// <returns>Dashboard data</returns>
    public async Task<DashboardDto> GetDashboardData(int storeId)
    {
        int year = DateTimeHelper.GetSwedishTime().Year;
        int month = DateTimeHelper.GetSwedishTime().Month;
        int day = DateTimeHelper.GetSwedishTime().Day;
        int daysInMonth = DateTime.DaysInMonth(year, month);
        int yesterday = Math.Max(1, day - 1);

        DateTime startOfMonth = new DateTime(year, month, 1);
        DateTime endOfMonth = startOfMonth.AddMonths(1).AddSeconds(-1);

        List<Budget> budgets = await budgetRepository.GetBudgetFromDatabase(storeId, year, month);
        if (!budgets.Any()) throw new InvalidOperationException("Tekniskt fel: Ingen budget hittades i systemet. Kontakta support om problemet kvarstår.");

        int totalBudget = budgets.Sum(b => b.OperatorBudget);

        Dictionary<int, int> dailySales = await orderRepository.GetAbonnemangSoldPerDayFromDatabase(startOfMonth, endOfMonth, storeId);
        Dictionary<int, int> soldAbonnemangsPerOperator = await orderRepository.GetAbonnemangSoldPerOperatorFromDatabase(startOfMonth, endOfMonth, storeId);
        int totalAbonnemangSold = soldAbonnemangsPerOperator.Values.Sum();

        List<DailySalesDto> dailySalesDto = Enumerable.Range(1, daysInMonth)
            .Select(day => new DailySalesDto
            {
                Day = day,
                AbonnemangsSold = day > yesterday ? null : (dailySales.TryGetValue(day, out int sold) ? sold : 0)
            }).ToList();

        double averagePerDay = (double)totalAbonnemangSold / day;
        double trendingAbonnemang = averagePerDay * daysInMonth;
        int trending = totalBudget > 0 ? (int)Math.Round(trendingAbonnemang / totalBudget * 100) : 0;

        List<EventDto> events = await orderRepository.GetLatestEventsFromDatabase(storeId);
        List<ActivityDto> activities = MapEventsToActivityDtos(events);
        ActivityFeedDto activityFeed = GetActivityFeed(activities);

        List<User> sellers = await userRepository.GetUsersByVaruhusFromDatabase(storeId);
        List<UserDto> sellerDtos = mapper.Map<List<UserDto>>(sellers);

        List<Contract> createdContracts = await orderRepository.GetContractsByTimeFromDatabase(startOfMonth, endOfMonth, storeId);
        List<Contract> cancelledContracts = await orderRepository.GetCancelledContractsByTimeFromDatabase(startOfMonth, endOfMonth, storeId);

        foreach (UserDto seller in sellerDtos)
        {
            List<Contract> sellerCreatedContracts = createdContracts.Where(c => c.Order.UserId == seller.Id).ToList();
            List<Contract> sellerCancelledContracts = cancelledContracts.Where(c => c.Order.UserId == seller.Id).ToList();

            int createdAbonnemang = sellerCreatedContracts.Count(c => c.AbonnemangId != null);
            int cancelledAbonnemang = sellerCancelledContracts.Count(c => c.AbonnemangId != null);
            seller.AbonnemangSold = createdAbonnemang - cancelledAbonnemang;

            int createdFokusAbonnemang = sellerCreatedContracts.Count(c => c.AbonnemangId != null && c.IsFokus);
            int cancelledFokusAbonnemang = sellerCancelledContracts.Count(c => c.AbonnemangId != null && c.IsFokus);
            seller.FokusAbonnemangSold = createdFokusAbonnemang - cancelledFokusAbonnemang;

            int createdBredband = sellerCreatedContracts.Count(c => c.BredbandId != null);
            int cancelledBredband = sellerCancelledContracts.Count(c => c.BredbandId != null);
            seller.BredbandSold = createdBredband - cancelledBredband;

            int createdTvStreaming = sellerCreatedContracts.Count(c => c.TvStreamingId != null);
            int cancelledTvStreaming = sellerCancelledContracts.Count(c => c.TvStreamingId != null);
            seller.TvStreamingSold = createdTvStreaming - cancelledTvStreaming;
        }

        return new DashboardDto
        {
            Budget = totalBudget,
            AbonnemangSold = totalAbonnemangSold,
            TrendingProcent = trending,
            DailySales = dailySalesDto,
            ActivityFeed = activityFeed,
            Sellers = sellerDtos
        };
    }

    /// <summary>
    /// Grupperar ordrar efter dag (Idag, Igår, I förrgår, 3+ dagar sedan)
    /// </summary>
    /// <param name="activities">De senaste händelserna</param>
    /// <returns>Aktivitetsflödet grupperat efter dag</returns>
    private ActivityFeedDto GetActivityFeed(List<ActivityDto> activities)
    {
        DateTime today = DateTimeHelper.GetSwedishTime().Date;
        DateTime yesterday = today.AddDays(-1);
        DateTime twoDaysAgo = today.AddDays(-2);

        ActivityFeedDto activityFeed = new ActivityFeedDto
        {
            Today = new List<ActivityDto>(),
            Yesterday = new List<ActivityDto>(),
            TwoDaysAgo = new List<ActivityDto>(),
            Older = new List<ActivityDto>()
        };

        List<ActivityDto> latestActivities = activities.OrderByDescending(a => a.EventTime).Take(6).ToList();

        foreach (ActivityDto activity in latestActivities)
        {
            DateTime date = activity.EventTime.Date;

            if (date == today)
            {
                activityFeed.Today.Add(activity);
            }

            else if (date == yesterday)
            {
                activityFeed.Yesterday.Add(activity);
            }

            else if (date == twoDaysAgo)
            {
                activityFeed.TwoDaysAgo.Add(activity);
            }

            else
            {
                activityFeed.Older.Add(activity);
            }
        }

        return activityFeed;
    }

    private List<ActivityDto> MapEventsToActivityDtos(List<EventDto> events)
    {
        List<ActivityDto> groupedActivities = events.GroupBy(e => new
        {
            e.OrderId,
            e.EventType,
            e.UserId,
            e.OperatorName,
            e.ContractType,
            e.IsFokus,
            EventMinute = new DateTime(e.EventTime.Year, e.EventTime.Month, e.EventTime.Day, e.EventTime.Hour, e.EventTime.Minute, 0)
        }).Select(g => new ActivityDto
        {
            OrderId = g.Key.OrderId,
            EventType = g.Key.EventType,
            ContractType = g.Key.ContractType,
            FirstName = g.First().FirstName,
            LastName = g.First().LastName,
            ContractCount = g.Count(),
            IsFokus = g.Key.IsFokus,
            OperatorName = g.Key.OperatorName,
            EventTime = g.Max(e => e.EventTime)
        }).OrderByDescending(a => a.EventTime).ToList();

        return groupedActivities;
    }
}
