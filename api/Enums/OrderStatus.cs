namespace api.Enums;

/// <summary>
/// Bestämmer vilken status på en order
/// </summary>
public enum OrderStatus
{
    /// <summary>
    /// Bekräftad
    /// </summary>
    Confirmed = 1,

    /// <summary>
    /// Makulerad
    /// </summary>
    Cancelled = 2,

    /// <summary>
    /// En order med både bekräftade och makulerade kontrakt
    /// </summary>
    Combined = 3
}
