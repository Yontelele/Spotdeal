namespace api.Dto;

/// <summary>
/// DTO för orderhistorik
/// </summary>
public class OrderPageDto
{
    /// <summary>
    /// Aktuell sida
    /// </summary>
    public int PageNumber { get; set; }

    /// <summary>
    /// Totalt antal objekt
    /// </summary>
    public int TotalCount { get; set; }

    /// <summary>
    /// Totalt antal sidor
    /// </summary>
    public int TotalPages => (int)Math.Ceiling(TotalCount / 10.0);

    /// <summary>
    /// Om det finns en föregående sida
    /// </summary>
    public bool HasPrevious => PageNumber > 1;

    /// <summary>
    /// Om det finns en nästa sida
    /// </summary>
    public bool HasNext => PageNumber < TotalPages;

    /// <summary>
    /// Ordrar för aktuell sida
    /// </summary>
    public List<OrderDto> Orders { get; set; } = new List<OrderDto>();
}
