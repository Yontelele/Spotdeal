using System.ComponentModel.DataAnnotations;

namespace api.Models;

/// <summary>
/// Databastabell för alla företag som ska nyttja plattformen
/// </summary>
public class Company : BaseEntity
{
    /// <summary>
    /// Namn på företag
    /// </summary>
    [Required, StringLength(100)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Relationskoppling: Ett företag kan ha flera varuhus
    /// </summary>
    public ICollection<Store> Stores { get; set; } = new List<Store>();
}
