using api.Enums;
using System.ComponentModel.DataAnnotations;

namespace api.Models;

/// <summary>
/// Databastabell för alla ordrar <br/>
/// Varje order är kopplad till en säljare och varuhus
/// </summary>
public class Order : BaseEntity
{
    /// <summary>
    /// Användar-ID som kopplar ordern till säljaren
    /// </summary>
    [Required]
    public int UserId { get; set; }

    /// <summary>
    /// Varuhus-ID som kopplar ordern till varuhuset
    /// </summary>
    [Required]
    public int StoreId { get; set; }

    /// <summary>
    /// Status på ordern
    /// </summary>
    [Required, StringLength(20)]
    public OrderStatus Status { get; set; } = OrderStatus.Confirmed;

    /// <summary>
    /// Vilken typ av kontrakt (Abonnemang, Bredband, TV)
    /// </summary>
    [Required, StringLength(20)]
    public ContractType ContractType { get; set; }

    /// <summary>
    /// Användaren som registrerade ordern
    /// </summary>
    public User User { get; set; } = null!;

    /// <summary>
    /// Varuhuset där ordern registrerades
    /// </summary>
    public Store Store { get; set; } = null!;

    /// <summary>
    /// En lista med kontrakt som innehåller alla artiklar som säljaren har registrerat <br/>
    /// Abonnemang, koder och telefoner
    /// </summary>
    public ICollection<Contract> Contracts { get; set; } = new List<Contract>();
}
