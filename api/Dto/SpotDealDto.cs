using api.Models;

namespace api.Dto;

/// <summary>
/// DTO för spotdeal
/// </summary>
public class SpotDealDto
{
    /// <summary>
    /// Primärnyckel 
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Abonnemang-ID som kopplar abonnemanget till spotdealen
    /// </summary>
    public int AbonnemangId { get; set; }

    /// <summary>
    /// Abonnemanget som spotdealen tillhör
    /// </summary>
    public AbonnemangDto Abonnemang { get; set; } = null!;

    /// <summary>
    /// Telefon-ID som kopplar en telefon till spotdealen
    /// </summary>
    public int PhoneId { get; set; }

    /// <summary>
    /// Telefonen som spotdealen tillhör
    /// </summary>
    public Phone Phone { get; set; } = null!;

    /// <summary>
    /// Rabatt som kunden får på telefonen i SEK
    /// </summary>
    public int DiscountAmount { get; set; } // TODO: Eventuellt göra om till pris på telefon
}
