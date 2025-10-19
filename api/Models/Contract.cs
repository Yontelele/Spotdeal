using api.Enums;
using System.ComponentModel.DataAnnotations;

namespace api.Models;

/// <summary>
/// Kontrakt som innehåller alla artiklar säljaren har registrerat <br/>
/// Flera kontrakt kan förekomma i en order
/// </summary>
public class Contract : BaseEntity
{
    /// <summary>
    /// Order-ID som kopplar kontraktet till ordern
    /// </summary>
    [Required]
    public int OrderId { get; set; }

    /// <summary>
    /// Ordern som kontraktet tillhör
    /// </summary>
    public Order Order { get; set; } = null!;

    /// <summary>
    /// Abonnemang-ID som kopplar abonnemanget till ordern
    /// </summary>
    public int? AbonnemangId { get; set; }

    /// <summary>
    /// Abonnemanget som kontraktet tillhör
    /// </summary>
    public Abonnemang? Abonnemang { get; set; }

    /// <summary>
    /// Bredband-ID som kopplar bredbandet till ordern
    /// </summary>
    public int? BredbandId { get; set; }

    /// <summary>
    /// Bredbandet som kontraktet tillhör
    /// </summary>
    public Bredband? Bredband { get; set; }

    /// <summary>
    /// TvStreaming-ID som kopplar TV och Streaming paketetet till ordern
    /// </summary>
    public int? TvStreamingId { get; set; }

    /// <summary>
    /// TV och Streaming paketet som kontraktet tillhör
    /// </summary>
    public TvStreaming? TvStreaming { get; set; }

    // --- Här skapas en gemensam snapshot --- \\

    /// <summary>
    /// Namn på artikeln vid registreringstillfället
    /// </summary>
    [Required, StringLength(100)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Bindningstidens längd i månader
    /// </summary>
    [Required]
    public int Bindningstid { get; set; }

    /// <summary>
    /// Provision som säljaren får för denna artikel vid registreringstillfället
    /// </summary>
    [Required]
    public int Provision { get; set; }

    /// <summary>
    /// Operator-ID som kopplar operatören till ordern
    /// </summary>
    [Required]
    public int OperatorId { get; set; }

    /// <summary>
    /// Namn på operatör
    /// </summary>
    [Required, StringLength(50)]
    public string OperatorName { get; set; } = string.Empty;

    /// <summary>
    /// URL till operatörens logotyp
    /// </summary>
    [StringLength(200)]
    public string OperatorLogoUrl { get; set; } = string.Empty;

    // --- Här skapas en snapshot av abonnemanget --- \\

    /// <summary>
    /// Ordinarie månadspris vid registreringstillfället
    /// </summary>
    public int? MonthlyPrice { get; set; }

    /// <summary>
    /// Bindningsrabatt i SEK per månad vid registreringstillfället
    /// </summary>
    public int? MonthlyDiscount { get; set; }

    /// <summary>
    /// Bindningsrabatt i antal månader vid registreringstillfället
    /// </summary>
    public int? MonthlyDiscountDuration { get; set; }

    /// <summary>
    /// Extra surf i GB vid registreringstillfället <br/>
    /// Ett abonnemang kan temporärt ha extra surf vid kampanj 
    /// </summary>
    public int? ExtraSurf { get; set; }

    /// <summary>
    /// Anger om abonnemanget är ett fokus-abonnemang vid registreringstillfället
    /// </summary>
    [Required]
    public bool IsFokus { get; set; }

    // --- Här skapas en snapshot vid val av telefon --- \\

    /// <summary>
    /// Telefon-ID som kopplar telefonen till ordern
    /// </summary>
    public int? PhoneId { get; set; }

    /// <summary>
    /// Flagga om telefonen är köpt med delbetalning vid registreringstillfället
    /// </summary>
    public bool? IsDelbetalning { get; set; }

    /// <summary>
    /// Total kostnad för telefonen efter eventuell rabatt vid registreringstillfället
    /// </summary>
    public int? PhoneCostAfterDiscount { get; set; }

    /// <summary>
    /// Företaget som skapat telefonen vid registreringstillfället
    /// </summary>
    [StringLength(50)]
    public string? PhoneBrand { get; set; }

    /// <summary>
    /// Telefonens modell vid registreringstillfället
    /// </summary>
    [StringLength(50)]
    public string? PhoneModel { get; set; }

    /// <summary>
    /// Telefonens lagringskapacitet vid registreringstillfället
    /// </summary>
    [StringLength(20)]
    public string? PhoneStorage { get; set; }

    /// <summary>
    /// Telefonens färg vid registreringstillfället
    /// </summary>
    [StringLength(50)]
    public string? PhoneColor { get; set; }

    /// <summary>
    /// Telefonens ordinarie pris vid registreringstillfället
    /// </summary>
    public int? PhonePrice { get; set; }

    /// <summary>
    /// Kod kopplad till telefonen vid registreringstillfället
    /// </summary>
    [StringLength(20)]
    public string? PhoneCode { get; set; }

    /// <summary>
    /// URL till telefonens bild vid registreringstillfället
    /// </summary>
    [StringLength(200)]
    public string? ImageUrl { get; set; }

    // --- Här lagras alla koder kopplade till kontraktet --- \\

    /// <summary>
    /// Genererade koder lagrade som JSON-sträng
    /// </summary>
    [Required]
    public string ContractCodes { get; set; } = string.Empty;

    // --- Här hanteras status av kontrakt --- \\

    /// <summary>
    /// Status för det individuella kontraktet
    /// </summary>
    [Required]
    public ContractStatus Status { get; set; } = ContractStatus.Confirmed;

    /// <summary>
    /// Användar-ID som makulerade kontraktet
    /// </summary>
    public int? CancelledByUserId { get; set; }

    /// <summary>
    /// Kommentar vid makulering
    /// </summary>
    [StringLength(500)]
    public string? CancellationReason { get; set; }

    /// <summary>
    /// Tidsstämpel på när användaren makulerade kontraktet
    /// </summary>
    public DateTime? CancelledAt { get; set; }

    /// <summary>
    /// Användaren som makulerade kontraktet
    /// </summary>
    public User? CancelledByUser { get; set; }
}
