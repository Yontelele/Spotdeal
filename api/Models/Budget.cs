using System.ComponentModel.DataAnnotations;

namespace api.Models;

/// <summary>
/// Databastabell för budget <br/>
/// Varje budget är kopplat till en operatör, ett varuhus samt en månad
/// </summary>
public class Budget : BaseEntity
{
    /// <summary>
    /// Varuhus-ID som kopplar budget med varuhus
    /// </summary>
    [Required]
    public int StoreId { get; set; }

    /// <summary>
    /// Operatör-ID som kopplar budget med operatören
    /// </summary>
    [Required]
    public int OperatorId { get; set; }

    /// <summary>
    /// Vilket år som budgeten är kopplad till
    /// </summary>
    [Required]
    public int Year { get; set; }

    /// <summary>
    /// Vilken månad som budgeten är kopplad till
    /// </summary>
    [Required]
    [Range(1, 12, ErrorMessage = "Månad måste vara mellan 1 och 12")]
    public int Month { get; set; }

    /// <summary>
    /// Antal abonnemang som ska säljas kopplat till den operatören
    /// </summary>
    [Required]
    public int OperatorBudget { get; set; }

    /// <summary>
    /// Varuhuset som är kopplat till budgeten
    /// </summary>
    public Store Store { get; set; } = null!;

    /// <summary>
    /// Operatören som är kopplat till budgeten
    /// </summary>
    public Operator Operator { get; set; } = null!;
}
