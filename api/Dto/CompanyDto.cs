namespace api.Dto;

/// <summary>
/// DTO för företag
/// </summary>
public class CompanyDto
{
    /// <summary>
    /// Primärnyckel 
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Namn på företag
    /// </summary>
    public string Name { get; set; } = string.Empty;
}
