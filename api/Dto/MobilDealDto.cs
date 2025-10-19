using api.Models;

namespace api.Dto;

/// <summary>
/// DTO för mobildeal
/// </summary>
public class MobilDealDto
{
    /// <summary>
    /// Den valda telefonen som mobildealsen är kopplad till
    /// </summary>
    public Phone Phone { get; set; } = null!;

    /// <summary>
    /// Totalt antal tillgängliga abonnemang som matchades
    /// </summary>
    public int TotalAvailableDeals { get; set; }

    /// <summary>
    /// Lista med de kvalificerade abonnemangen kategoriserade
    /// </summary>
    public List<MobilDeal> Mobildeals { get; set; } = new List<MobilDeal>();
}
