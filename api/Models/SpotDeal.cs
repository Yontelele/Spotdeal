using System.ComponentModel.DataAnnotations;

namespace api.Models;

/// <summary>
/// Databastabell för alla spotdeals <br/>
/// En spotdeal är en kampanj där ett specifikt abonnemang kombinerat med en specifik telefon <br/>
/// ger kunden extra mycket rabatt på telefonen
/// </summary>
public class SpotDeal : BaseEntity
{
    /// <summary>
    /// Abonnemang-ID som kopplar abonnemanget till spotdealen
    /// </summary>
    [Required]
    public int AbonnemangId { get; set; }

    /// <summary>
    /// Abonnemanget som spotdealen tillhör
    /// </summary>
    public Abonnemang Abonnemang { get; set; } = null!;

    /// <summary>
    /// Telefon-ID som kopplar en telefon till spotdealen
    /// </summary>
    [Required]
    public int PhoneId { get; set; }

    /// <summary>
    /// Telefonen som spotdealen tillhör
    /// </summary>
    public Phone Phone { get; set; } = null!;

    /// <summary>
    /// Rabatt som kunden får på telefonen i SEK
    /// </summary>
    [Required]
    public int DiscountAmount { get; set; } // TODO: Eventuellt göra om till pris på telefon
}
