namespace api.Dto;

/// <summary>
/// DTO för operatör
/// </summary>
public class OperatorDto
{
    /// <summary>
    /// Primärnyckel 
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Namn på operatör
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// URL till operatörens logotyp
    /// </summary>
    public string LogoUrl { get; set; } = string.Empty;
}
