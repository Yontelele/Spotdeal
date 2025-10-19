using api.Enums;

namespace api.Dto;

/// <summary>
/// Representerar en händelse för ett kontrakt (t.ex. skapande eller makulering). <br/>
/// Används när aktivitetsflödet byggs upp från kontrakts-händelser.
/// </summary>
public class EventDto
{
    /// <summary>
    /// ID kopplat till kontraktet
    /// </summary>
    public int ContractId { get; set; }

    /// <summary>
    /// ID för ordern som kontraktet tillhör
    /// </summary>
    public int OrderId { get; set; }

    /// <summary>
    /// Användarens ID för den som utförde händelsen (t.ex. den som skapade eller makulerade kontraktet)
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// Förnamn för den användare som utförde händelsen
    /// </summary>
    public string FirstName { get; set; } = string.Empty;

    /// <summary>
    /// Efternamn för den användare som utförde händelsen
    /// </summary>
    public string LastName { get; set; } = string.Empty;

    /// <summary>
    /// Typ av händelse som inträffade för kontraktet (t.ex. Created eller Cancelled)
    /// </summary>
    public EventType EventType { get; set; }

    /// <summary>
    /// Tidpunkt då händelsen inträffade
    /// </summary>
    public DateTime EventTime { get; set; }

    /// <summary>
    /// Vilken typ av kontrakt händelsen avser (Abonnemang, Bredband, TV)
    /// </summary>
    public ContractType ContractType { get; set; }

    /// <summary>
    /// Namn på operatören kopplad till kontraktet
    /// </summary>
    public string OperatorName { get; set; } = string.Empty;

    /// <summary>
    /// Flagga om abonnemanget är fokus
    /// </summary>
    public bool IsFokus { get; set; }
}

