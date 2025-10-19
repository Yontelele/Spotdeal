namespace api.Dto;

/// <summary>
/// DTO för kontraktkod
/// </summary>
public class ContractCodeDto
{
    /// <summary>
    /// Koden som kopieras in i säljsystemet
    /// </summary>
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Beskrivning av koden
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Koden kan ha ett värde kopplat till sig (SEK)<br/>
    /// Värdet kan vara priset eller rabatten på en produkt
    /// </summary>
    public int? Value { get; set; }
}
