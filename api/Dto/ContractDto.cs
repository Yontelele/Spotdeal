using api.Enums;
using api.Models;

namespace api.Dto;

/// <summary>
/// DTO för kontrakt
/// </summary>
public class ContractDto
{
    /// <summary>
    /// Primärnyckel 
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Order-ID som kopplar kontraktet till ordern
    /// </summary>
    public int OrderId { get; set; }

    /// <summary>
    /// Abonnemang-ID som kopplar abonnemanget till ordern
    /// </summary>
    public int? AbonnemangId { get; set; }

    /// <summary>
    /// Bredband-ID som kopplar bredbandet till ordern
    /// </summary>
    public int? BredbandId { get; set; }

    /// <summary>
    /// TvStreaming-ID som kopplar TV och Streaming paketetet till ordern
    /// </summary>
    public int? TvStreamingId { get; set; }

    // --- Här skapas en gemensam snapshot --- \\

    /// <summary>
    /// Namn på abonnemanget vid registreringstillfället
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Bindningstidens längd i månader
    /// </summary>
    public int Bindningstid { get; set; }

    /// <summary>
    /// Provision som säljaren får för denna artikel vid registreringstillfället
    /// </summary>
    public int Provision { get; set; }

    /// <summary>
    /// Operator-ID som kopplar operatören till ordern
    /// </summary>
    public int OperatorId { get; set; }

    /// <summary>
    /// Namn på operatör
    /// </summary>
    public string OperatorName { get; set; } = string.Empty;

    /// <summary>
    /// URL till operatörens logotyp
    /// </summary>
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
    public string? PhoneBrand { get; set; }

    /// <summary>
    /// Telefonens modell vid registreringstillfället
    /// </summary>
    public string? PhoneModel { get; set; }

    /// <summary>
    /// Telefonens lagringskapacitet vid registreringstillfället
    /// </summary>
    public string? PhoneStorage { get; set; }

    /// <summary>
    /// Telefonens färg vid registreringstillfället
    /// </summary>
    public string? PhoneColor { get; set; }

    /// <summary>
    /// Telefonens ordinarie pris vid registreringstillfället
    /// </summary>
    public int? PhonePrice { get; set; }

    /// <summary>
    /// Kod kopplad till telefonen vid registreringstillfället
    /// </summary>
    public string? PhoneCode { get; set; }

    /// <summary>
    /// URL till telefonens bild vid registreringstillfället
    /// </summary>
    public string? ImageUrl { get; set; }

    // --- Här lagras alla koder kopplade till kontraktet --- \\

    /// <summary>
    /// Genererade koder som JSON
    /// </summary>
    public List<ContractCodeDto> ContractCodes { get; set; } = new List<ContractCodeDto>();

    // --- Här hanteras status av kontrakt --- \\

    /// <summary>
    /// Status för det individuella kontraktet
    /// </summary>
    public ContractStatus Status { get; set; } = ContractStatus.Confirmed;

    /// <summary>
    /// Användar-ID som makulerade kontraktet
    /// </summary>
    public int? CancelledByUserId { get; set; }

    /// <summary>
    /// Kommentar vid makulering
    /// </summary>
    public string? CancellationReason { get; set; }

    /// <summary>
    /// Tidsstämpel på när användaren makulerade kontraktet
    /// </summary>
    public DateTime? CancelledAt { get; set; }

    /// <summary>
    /// Användaren som makulerade kontraktet
    /// </summary>
    public UserDto? CancelledByUser { get; set; }
}
