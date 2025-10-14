namespace api.Dto;

/// <summary>
/// DTO för TV och Streaming paket
/// </summary>
public class TvStreamingDto
{
    /// <summary>
    /// Primärnyckel 
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Namn på TV och Streaming paketet
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// TV och Streaming paketets namn som visas inuti registreringskorten <br/>
    /// Namnet är mycket förkortat för att få plats i korten
    /// </summary>
    public string RegistrationName { get; set; } = string.Empty;

    /// <summary>
    /// Bindningstidens längd i månader
    /// </summary>
    public int Bindningstid { get; set; }

    /// <summary>
    /// Kod kopplad till TV och Streaming paketet <br/>
    /// Denna kod kopieras och läggs in i säljsystemet
    /// </summary>
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Provision som säljaren får för detta TV och Streaming paket
    /// </summary>
    public int Provision { get; set; }

    /// <summary>
    /// Operatör-ID som kopplar TV och Streaming paketet med operatören
    /// </summary>
    public int OperatorId { get; set; }

    /// <summary>
    /// Operatören som är kopplat till TV och Streaming paketet
    /// </summary>
    public OperatorDto Operator { get; set; } = null!;
}
