namespace api.Dto;

/// <summary>
/// DTO för aktivitetsflöde
/// </summary>
public class ActivityFeedDto
{
    /// <summary>
    /// Aktiviteter från idag
    /// </summary>
    public List<ActivityDto> Today { get; set; } = new List<ActivityDto>();

    /// <summary>
    /// Aktiviteter från igår
    /// </summary>
    public List<ActivityDto> Yesterday { get; set; } = new List<ActivityDto>();

    /// <summary>
    /// Aktiviteter från i förrgår
    /// </summary>
    public List<ActivityDto> TwoDaysAgo { get; set; } = new List<ActivityDto>();

    /// <summary>
    /// Aktiviteter från 3+ dagar sedan
    /// </summary>
    public List<ActivityDto> Older { get; set; } = new List<ActivityDto>();
}