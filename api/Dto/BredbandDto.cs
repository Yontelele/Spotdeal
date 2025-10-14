namespace api.Dto;

/// <summary>
/// DTO för bredband
/// </summary>
public class BredbandDto
{
    /// <summary>
    /// Primärnyckel 
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Namn på bredbandet
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Bredbandets namn som visas inuti registreringskorten <br/>
    /// Namnet är mycket förkortat för att få plats i korten
    /// </summary>
    public string RegistrationName { get; set; } = string.Empty;

    /// <summary>
    /// Bindningstidens längd i månader
    /// </summary>
    public int Bindningstid { get; set; }

    /// <summary>
    /// Kod kopplad till bredbandet <br/>
    /// Denna kod kopieras och läggs in i säljsystemet
    /// </summary>
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Provision som säljaren får för detta bredband
    /// </summary>
    public int Provision { get; set; }

    /// <summary>
    /// Operatör-ID som kopplar bredbandet med operatören
    /// </summary>
    public int OperatorId { get; set; }

    /// <summary>
    /// Operatören som är kopplat till bredbandet
    /// </summary>
    public OperatorDto Operator { get; set; } = null!;
}
