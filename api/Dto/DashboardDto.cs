namespace api.Dto;

/// <summary>
/// DTO för dashboard
/// </summary>
public class DashboardDto
{
    /// <summary>
    /// Summan av alla operatörsbudgetar
    /// </summary>
    public int Budget { get; set; }

    /// <summary>
    /// Totalt sålda abonnemang
    /// </summary>
    public int AbonnemangSold { get; set; }

    /// <summary>
    /// Procentuell uppskattning av förväntad försäljning jämfört med budget baserat på nuvarande trend.
    /// </summary>
    public int TrendingProcent { get; set; }

    /// <summary>
    /// Lista över daglig försäljningsdata
    /// </summary>
    public List<DailySalesDto> DailySales { get; set; } = new List<DailySalesDto>();

    /// <summary>
    /// Senaste händelser i aktivitetsflödet
    /// </summary>
    public ActivityFeedDto ActivityFeed { get; set; } = new ActivityFeedDto();

    /// <summary>
    /// Lista med alla säljare kopplat till varuhuset
    /// </summary>
    public List<UserDto> Sellers { get; set; } = new List<UserDto>();
}
