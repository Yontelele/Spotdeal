namespace api.Enums;

/// <summary>
/// Bestämmer vilken typ av kontrakt
/// </summary>
public enum ContractType
{
    /// <summary>
    /// Kontraktet är av typen mobilabonnemang
    /// </summary>
    Abonnemang = 1,

    /// <summary>
    /// Kontraktet är av typen bredband
    /// </summary>
    Bredband = 2,

    /// <summary>
    /// Kontraktet är av typen TV
    /// </summary>
    TV = 3,
}
