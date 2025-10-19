using api.Enums;

namespace api.Dto;

/// <summary>
/// DTO för aktiviteter <br/>
/// Används i aktivitetsflödet
/// </summary>
public class ActivityDto
{
    /// <summary>
    /// Order-ID
    /// </summary>
    public int OrderId { get; set; }

    /// <summary>
    /// Typ av händelse
    /// </summary>
    public EventType EventType { get; set; }

    /// <summary>
    /// Vilken typ av kontrakt (Abonnemang, Bredband, TV)
    /// </summary>
    public ContractType ContractType { get; set; }

    /// <summary>
    /// Användarens förnamn
    /// </summary>
    public string FirstName { get; set; } = string.Empty;

    /// <summary>
    /// Användarens efternamn
    /// </summary>
    public string LastName { get; set; } = string.Empty;

    /// <summary>
    /// Antal kontrakt i denna grupperade aktivitet
    /// </summary>
    public int ContractCount { get; set; }

    /// <summary>
    /// Abonnemangstyp (fokus eller befintligt)
    /// </summary>
    public bool IsFokus { get; set; }

    /// <summary>
    /// Operatörens namn
    /// </summary>
    public string OperatorName { get; set; } = string.Empty;

    /// <summary>
    /// Tidsstämpel för händelsen
    /// </summary>
    public DateTime EventTime { get; set; }
}