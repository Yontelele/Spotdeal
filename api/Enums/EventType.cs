namespace api.Enums;

/// <summary>
/// Bestämmer vilken händelse på en aktivitet
/// </summary>
public enum EventType
{
    /// <summary>
    /// Händelse där ett kontrakt är skapat
    /// </summary>
    Created = 1,

    /// <summary>
    /// Händelse där ett kontrakt är makulerat
    /// </summary>
    Cancelled = 2
}
