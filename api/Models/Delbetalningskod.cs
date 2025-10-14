using System.ComponentModel.DataAnnotations;

namespace api.Models;

/// <summary>
/// Databastabell för delbetalningskoder
/// </summary>
public class Delbetalningskod : BaseEntity
{
    /// <summary>
    /// Koden som kopieras in i säljsystemet
    /// </summary>
    [Required, StringLength(20)]
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Beskrivning av koden
    /// </summary>
    [Required, StringLength(50)]
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Priset kunden betalar varje månad för delbetalningen
    /// </summary>
    public int? MonthlyCost { get; set; }

    /// <summary>
    /// Den totala delbetalningskostnaden
    /// </summary>
    [Required]
    public int TotalCost { get; set; }

    /// <summary>
    /// Operatör-ID som kopplar delbetalningskoden med operatören
    /// </summary>
    [Required]
    public int OperatorId { get; set; }

    /// <summary>
    /// Operatören som är kopplat till delbetalningskoden
    /// </summary>
    public Operator Operator { get; set; } = null!;
}
