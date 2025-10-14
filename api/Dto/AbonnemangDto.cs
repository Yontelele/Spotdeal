namespace api.Dto;

/// <summary>
/// DTO för abonnemang
/// </summary>
public class AbonnemangDto
{
    /// <summary>
    /// Primärnyckel 
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Namn på abonnemanget
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Abonnemangets namn som visas inuti registreringskorten <br/>
    /// Namnet är mycket förkortat för att få plats i korten
    /// </summary>
    public string RegistrationName { get; set; } = string.Empty;

    /// <summary>
    /// Abonnemangets namn som visas i "lathunden" <br/>
    /// Namnet är justerat vid extra användare
    /// </summary>
    public string? TableName { get; set; }

    /// <summary>
    /// Ordinarie månadspris
    /// </summary>
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
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Bindningstidens längd i månader
    /// </summary>
    public int Bindningstid { get; set; }

    /// <summary>
    /// Provision som säljaren får för detta abonnemang
    /// </summary>
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
    public int OperatorId { get; set; }

    /// <summary>
    /// Operatören som är kopplat till abonnemanget
    /// </summary>
    public OperatorDto Operator { get; set; } = null!;
}
