namespace api.Dto;

/// <summary>
/// DTO för daglig försäljningsdata
/// </summary>
public class DailySalesDto
{
    /// <summary>
    /// Dag i månaden (1–31)
    /// </summary>
    public int Day { get; set; }

    /// <summary>
    /// Antal sålda abonnemang
    /// </summary>
    public int? AbonnemangsSold { get; set; } 
}
