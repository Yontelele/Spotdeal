namespace api.Enums;

/// <summary>
/// Bestämmer vilken status på en order
/// </summary>
public enum ContractStatus
{
    /// <summary>
    /// Bekräftad
    /// </summary>
    Confirmed = 1,

    /// <summary>
    /// Makulerad
    /// </summary>
    Cancelled = 2
}
