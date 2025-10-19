using System.ComponentModel.DataAnnotations;

namespace api.Models;

/// <summary>
/// Databastabell för alla operatörer
/// </summary>
public class Operator : BaseEntity
{
    /// <summary>
    /// Namn på operatör
    /// </summary>
    [Required, StringLength(50)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// URL till operatörens logotyp
    /// </summary>
    [StringLength(200)]
    public string LogoUrl { get; set; } = string.Empty;

    /// <summary>
    /// Lista med abonnemang kopplade till operatören
    /// </summary>
    public ICollection<Abonnemang> Abonnemang { get; set; } = new List<Abonnemang>();

    /// <summary>
    /// Lista med bredband kopplade till operatören
    /// </summary>
    public ICollection<Bredband> Bredband { get; set; } = new List<Bredband>();

    /// <summary>
    /// Lista med TV och Streaming paket kopplade till operatören
    /// </summary>
    public ICollection<TvStreaming> TvStreaming { get; set; } = new List<TvStreaming>();

    /// <summary>
    /// Lista med kontraktkoder kopplade till operatören
    /// </summary>
    public ICollection<ContractCode> ContractCodes { get; set; } = new List<ContractCode>();

    /// <summary>
    /// Lista med delbetalningskoder kopplade till operatören
    /// </summary>
    public ICollection<Delbetalningskod> Delbetalningskoder { get; set; } = new List<Delbetalningskod>();

    /// <summary>
    /// Lista med budgets kopplade till operatören
    /// </summary>
    public ICollection<Budget> Budgets { get; set; } = new List<Budget>();
}
