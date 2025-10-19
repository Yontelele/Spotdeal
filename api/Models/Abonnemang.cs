using System.ComponentModel.DataAnnotations;

namespace api.Models;

/// <summary>
/// Databastabell för alla abonnemang <br/>
/// Varje abonnemang är kopplad till en operatör
/// </summary>
public class Abonnemang : BaseEntity
{
    /// <summary>
    /// Namn på abonnemanget
    /// </summary>
    [Required, StringLength(100)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Abonnemangets namn som visas inuti registreringskorten <br/>
    /// Namnet är mycket förkortat för att få plats i korten
    /// </summary>
    [Required, StringLength(50)]
    public string RegistrationName { get; set; } = string.Empty;

    /// <summary>
    /// Abonnemangets namn som visas i "lathunden" <br/>
    /// Namnet är justerat vid extra användare
    /// </summary>
    [StringLength(100)]
    public string? TableName { get; set; }

    /// <summary>
    /// Ordinarie månadspris
    /// </summary>
    [Required]
    public int MonthlyPrice { get; set; }

    /// <summary>
    /// Bindningsrabatt i SEK per månad
    /// </summary>
    public int? MonthlyDiscount { get; set; }

    /// <summary>
    /// Bindningsrabatt i antal månader
    /// </summary>
    public int? MonthlyDiscountDuration { get; set; }

    /// <summary>
    /// Kod kopplad till abonnemanget <br/>
    /// Denna kod kopieras och läggs in i säljsystemet
    /// </summary>
    [Required, StringLength(20)]
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Bindningstidens längd i månader
    /// </summary>
    [Required]
    public int Bindningstid { get; set; }

    /// <summary>
    /// Provision som säljaren får för detta abonnemang
    /// </summary>
    [Required]
    public int Provision { get; set; }

    /// <summary>
    /// Surfmängd i GB <br/>
    /// Vid obegränsad surf så är denna null
    /// </summary>
    public int? Surf { get; set; }

    /// <summary>
    /// Extra surf i GB <br/>
    /// Ett abonnemang kan temporärt ha extra surf vid kampanj 
    /// </summary>
    public int? ExtraSurf { get; set; }

    /// <summary>
    /// Rabatt som säljaren får ge kunden i SEK
    /// </summary>
    [Required]
    public int Discount { get; set; }

    /// <summary>
    /// Flagga om abonnemanget är fokus
    /// </summary>
    public bool IsFokus { get; set; }

    /// <summary>
    /// Styr om abonnemanget ska visas i lathunden
    /// </summary>
    public bool ShowInTable { get; set; }

    /// <summary>
    /// Styr om abonnemanget ska visas i mobildeals
    /// </summary>
    public bool ShowInMobilDeal { get; set; }

    /// <summary>
    /// Abonnemang-ID på extra användaren <br/>
    /// Mappar huvudabonnemang med extra användare
    /// </summary>
    public int? LinkedExtraAnvandareId { get; set; }

    /// <summary>
    /// Flagga om abonnemanget har obegränsad surf
    /// </summary>
    public bool IsObegransadSurf { get; set; }

    /// <summary>
    /// Flagga om abonnemanget kan ha extra användare kopplad till sig
    /// </summary>
    public bool CanHaveExtraAnvandare { get; set; }

    /// <summary>
    /// Flagga om abonnemanget är ett huvudabonnemang
    /// </summary>
    public bool IsHuvudAbonnemang { get; set; }

    /// <summary>
    /// Flagga om abonnemanget är ett befintligt abonnemang <br />
    /// Ett abonnemang som kunden redan har men förlänger med bindningstid
    /// </summary>
    public bool IsBefintligtAbonnemang { get; set; }

    /// <summary>
    /// Flagga om abonnemanget är enbart för delbetalning med telefon
    /// </summary>
    public bool IsForDelbetalningOnly { get; set; }

    /// <summary>
    /// Flagga om abonnemanget är enbart för ungdomar/studenter
    /// </summary>
    public bool IsUngdomsAbonnemang { get; set; }

    /// <summary>
    /// Operatör-ID som kopplar abonnemanget med operatören
    /// </summary>
    [Required]
    public int OperatorId { get; set; }

    /// <summary>
    /// Operatören som är kopplat till abonnemanget
    /// </summary>
    public Operator Operator { get; set; } = null!;

    /// <summary>
    /// Lista med kontrakt kopplade till abonnemanget
    /// </summary>
    public ICollection<Contract> Contracts { get; set; } = new List<Contract>();

    /// <summary>
    /// Lista med spotdeals kopplade till abonnemanget
    /// </summary>
    public ICollection<SpotDeal> SpotDeals { get; set; } = new List<SpotDeal>();

    /// <summary>
    /// Lista med subventionskopplingar kopplade till abonnemanget
    /// </summary>
    public ICollection<Subventionskoppling> Subventionskopplingar { get; set; } = new List<Subventionskoppling>();
}
