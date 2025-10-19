namespace api.Enums;

/// <summary>
/// Bestämmer vilken typ av kod det är
/// </summary>
public enum ContractCodeType
{
    /// <summary>
    /// Denna kod används för att ge rabatt på en produkt
    /// </summary>
    AbonnemangsRabatt,

    /// <summary>
    /// Denna kod används i kombination med delbetalningskoden
    /// </summary>
    ForhojdAvgift,

    /// <summary>
    /// Denna kod används för att visa att telefon tagits på delbetalning
    /// </summary>
    DelbetalaHardvara,

    /// <summary>
    /// Denna kod används för att kunden ska betala inträdesavgift
    /// </summary>
    IntradesAvgift,
}
