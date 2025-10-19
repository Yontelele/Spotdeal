namespace api.Dto;

/// <summary>
/// DTO för att makulera en order
/// </summary>
public class CancelOrderDto
{
    /// <summary>
    /// De kontrakt som ska makuleras
    /// </summary>
    public List<int> ContractIds { get; set; } = new List<int>();

    /// <summary>
    /// Anledning för makulering
    /// </summary>
    public string Reason { get; set; } = string.Empty;
}
