using System.ComponentModel.DataAnnotations;

namespace api.Models;

/// <summary>
/// Databastabell för subventionskoder
/// </summary>
public class Subventionskod : BaseEntity
{
    /// <summary>
    /// Koden som kopieras in i säljsystemet
    /// </summary>
    [Required, StringLength(50)]
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Beskrivning av koden
    /// </summary>
    [Required, StringLength(100)]
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Flagga om koden är aktiv och ska dyka upp vid registrering
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Från vilket datum som koden är i bruk
    /// </summary>
    public DateOnly ValidFrom { get; set; }

    /// <summary>
    /// Till vilket datum som koden är i bruk
    /// </summary>
    public DateOnly ValidTo { get; set; }

    /// <summary>
    /// Lista som kopplar ihop subventionskod med abonnemang och eventuell telefon
    /// </summary>
    public ICollection<Subventionskoppling> Subventionskopplingar { get; set; } = new List<Subventionskoppling>();
}
