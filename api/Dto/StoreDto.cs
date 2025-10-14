namespace api.Dto;

/// <summary>
/// DTO för varuhus
/// </summary>
public class StoreDto
{
    /// <summary>
    /// Primärnyckel 
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Företags-ID som kopplar varuhus med företag
    /// </summary>
    public int CompanyId { get; set; }

    /// <summary>
    /// Namn på varuhuset
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Staden som varuhuset ligger i
    /// </summary>
    public string City { get; set; } = string.Empty;

    /// <summary>
    /// Status om varuhuset ska nyttja plattformen
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Företaget som är kopplat till varuhuset
    /// </summary>
    public CompanyDto Company { get; set; } = null!;
}
