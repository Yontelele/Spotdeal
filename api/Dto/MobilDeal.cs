namespace api.Dto;

/// <summary>
/// Detta är abonnemanget som har kvalificerats till en mobildeal
/// </summary>
public class MobilDeal
{
    /// <summary>
    /// Priset för mobildealen
    /// Detta är priset för telefonens delbetalningspris adderat med abonnemangskostnaden
    /// </summary>
    public int TotalMonthlyCost { get; set; }

    /// <summary>
    /// Delbetalningspriset för telefonen
    /// </summary>
    public int PhoneMontlyCost { get; set; }

    /// <summary>
    /// Rabatten som denna mobildeal ger kunden
    /// </summary>
    public int PhoneDiscount { get; set; }

    /// <summary>
    /// Om denna mobildeal tillhör en spotdeal
    /// Spotdeal är en kampanj där ett specifikt abonnemang kombinerat med en spcifik telefon ger extra rabatt
    /// </summary>
    public bool IsSpotDeal { get; set; }

    /// <summary>
    /// Kategorier som detta abonnemang kvalificerat sig in i
    /// </summary>
    public List<string> Categories { get; set; } = new List<string>();

    /// <summary>
    /// Score för abonnemang baserat på flera faktorer
    /// </summary>
    public double Score { get; set; }

    /// <summary>
    /// Abonnemanget som mobildealen tillhör
    /// </summary>
    public AbonnemangDto Abonnemang { get; set; } = null!;
}
