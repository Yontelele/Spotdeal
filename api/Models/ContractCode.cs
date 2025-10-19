using api.Enums;
using System.ComponentModel.DataAnnotations;

namespace api.Models;

/// <summary>
/// Databastabell för kontraktkoder
/// </summary>
public class ContractCode : BaseEntity
{
    /// <summary>
    /// Operatör-ID som kopplar kontraktkoden med operatören
    /// </summary>
    [Required]
    public int OperatorId { get; set; }

    /// <summary>
    /// Koden som kopieras in i säljsystemet
    /// </summary>
    [Required, StringLength(20)]
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Beskrivning av koden
    /// </summary>
    [Required, StringLength(100)]
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Bestämmer vilken typ av kod det är
    /// </summary>
    [Required, StringLength(50)]
    public ContractCodeType CodeType { get; set; }

    /// <summary>
    /// Koden kan ha ett värde kopplat till sig (SEK)
    /// </summary>
    public int? Value { get; set; }

    /// <summary>
    /// Operatören som är kopplat till kontraktkoden
    /// </summary>
    public Operator Operator { get; set; } = null!;
}
