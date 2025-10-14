using System.ComponentModel.DataAnnotations;

namespace api.Models;

/// <summary>
/// Databastabell för alla TV och Streaming paket <br/>
/// Varje TV och Streaming paket är kopplad till en operatör
/// </summary>
public class TvStreaming : BaseEntity
{
    /// <summary>
    /// Namn på TV och Streaming paketet
    /// </summary>
    [Required, StringLength(100)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// TV och Streaming paketets namn som visas inuti registreringskorten <br/>
    /// Namnet är mycket förkortat för att få plats i korten
    /// </summary>
    [Required, StringLength(50)]
    public string RegistrationName { get; set; } = string.Empty;

    /// <summary>
    /// Bindningstidens längd i månader
    /// </summary>
    [Required]
    public int Bindningstid { get; set; }

    /// <summary>
    /// Kod kopplad till TV och Streaming paketet <br/>
    /// Denna kod kopieras och läggs in i säljsystemet
    /// </summary>
    [Required, StringLength(20)]
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Provision som säljaren får för detta TV och Streaming paket
    /// </summary>
    [Required]
    public int Provision { get; set; }

    /// <summary>
    /// Operatör-ID som kopplar TV och Streaming paketet med operatören
    /// </summary>
    [Required]
    public int OperatorId { get; set; }

    /// <summary>
    /// Operatören som är kopplat till TV och Streaming paketet
    /// </summary>
    public Operator Operator { get; set; } = null!;

    /// <summary>
    /// Lista med kontrakt kopplade till TV och Streaming paketet
    /// </summary>
    public ICollection<Contract> Contracts { get; set; } = new List<Contract>();
}
