using System.ComponentModel.DataAnnotations;

namespace api.Models;

/// <summary>
/// Databastabell för alla bredband <br/>
/// Varje bredband är kopplad till en operatör
/// </summary>
public class Bredband : BaseEntity
{
    /// <summary>
    /// Namn på bredbandet
    /// </summary>
    [Required, StringLength(100)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Bredbandets namn som visas inuti registreringskorten <br/>
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
    /// Kod kopplad till bredbandet <br/>
    /// Denna kod kopieras och läggs in i säljsystemet
    /// </summary>
    [Required, StringLength(20)]
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Provision som säljaren får för detta bredband
    /// </summary>
    [Required]
    public int Provision { get; set; }

    /// <summary>
    /// Operatör-ID som kopplar bredbandet med operatören
    /// </summary>
    [Required]
    public int OperatorId { get; set; }

    /// <summary>
    /// Operatören som är kopplat till bredbandet
    /// </summary>
    public Operator Operator { get; set; } = null!;

    /// <summary>
    /// Lista med kontrakt kopplade till bredbandet
    /// </summary>
    public ICollection<Contract> Contracts { get; set; } = new List<Contract>();
}