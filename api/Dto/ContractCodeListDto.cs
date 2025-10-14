namespace api.Dto;

/// <summary>
/// DTO för lista med kontraktkoder kopplade till ett abonnemang
/// </summary>
public class ContractCodeListDto
{
    /// <summary>
    /// Abonnemanget alla koder ska kopplas till
    /// </summary>
    public int AbonnemangId { get; set; }

    /// <summary>
    /// Lista med kontraktkoder
    /// </summary>
    public List<ContractCodeDto> Codes { get; set; } = new List<ContractCodeDto>();
}
