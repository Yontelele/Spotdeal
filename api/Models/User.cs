using api.Enums;
using System.ComponentModel.DataAnnotations;

namespace api.Models;

/// <summary>
/// Databastabell för alla användare som ska nyttja plattformen <br/>
/// Varje användare är kopplad till ett varuhus
/// </summary>
public class User : BaseEntity
{
    /// <summary>
    /// Förnamn på användaren
    /// </summary>
    [Required, StringLength(50)]
    public string FirstName { get; set; } = string.Empty;

    /// <summary>
    /// Efternamn på användaren
    /// </summary>
    [Required, StringLength(50)]
    public string LastName { get; set; } = string.Empty;

    /// <summary>
    /// Mailadress kopplat till användaren
    /// </summary>
    [Required, StringLength(100)]
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Arbetstitel kopplad till användaren <br/>
    /// Säljare eller chef
    /// </summary>
    [Required, StringLength(20)]
    public UserRole Role { get; set; }

    /// <summary>
    /// Status om användaren ska nyttja plattformen
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Tidsstämpel på när användaren senast loggade in
    /// </summary>
    public DateTime? LastLogin { get; set; }

    /// <summary>
    /// Varuhus-ID som kopplar användaren med varuhus
    /// </summary>
    [Required]
    public int StoreId { get; set; }

    /// <summary>
    /// Varuhuset som är kopplat till användaren
    /// </summary>
    public Store Store { get; set; } = null!;

    /// <summary>
    /// Lista med alla ordrar användaren registrerat
    /// </summary>
    public ICollection<Order> Orders { get; set; } = new List<Order>();

    /// <summary>
    /// Lista med alla kontrakt användaren makulerat
    /// </summary>
    public ICollection<Contract> CancelledContracts { get; set; } = new List<Contract>();
}
