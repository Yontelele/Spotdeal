using System.ComponentModel.DataAnnotations;

namespace api.Models;

/// <summary>
/// Databastabell som kopplar ihop subventionskod med abonnemang och eventuell telefon
/// </summary>
public class Subventionskoppling : BaseEntity
{
    /// <summary>
    /// Subventionskod-ID som kopplar subventionskoden till abonnemang och telefon
    /// </summary>
    [Required]
    public int SubventionskodId { get; set; }

    /// <summary>
    /// Abonnemang-ID som kopplar abonnemanget till subventionskoden
    /// </summary>
    [Required]
    public int AbonnemangId { get; set; }

    /// <summary>
    /// Telefon-ID (valfritt) som kopplar en telefon till subventionskoden
    /// </summary>
    public int? PhoneId { get; set; }

    /// <summary>
    /// Subventionskoden som ska kopplas
    /// </summary>
    public Subventionskod Subventionskod { get; set; } = null!;

    /// <summary>
    /// Abonnemanget som subventionskoden tillhör
    /// </summary>
    public Abonnemang Abonnemang { get; set; } = null!;

    /// <summary>
    /// Telefonen som subventionskoden tillhör (valfri)
    /// </summary>
    public Phone? Phone { get; set; }
}
