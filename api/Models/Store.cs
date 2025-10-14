using System.ComponentModel.DataAnnotations;

namespace api.Models;

/// <summary>
/// Databastabell för alla varuhus som ska nyttja plattformen <br/>
/// Varje varuhus är kopplade till ett företag
/// </summary>
public class Store : BaseEntity
{
    /// <summary>
    /// Företags-ID som kopplar varuhus med företag
    /// </summary>
    [Required]
    public int CompanyId { get; set; }

    /// <summary>
    /// Namn på varuhuset
    /// </summary>
    [Required, StringLength(100)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Staden som varuhuset ligger i
    /// </summary>
    [Required, StringLength(50)]
    public string City { get; set; } = string.Empty;

    /// <summary>
    /// Status om varuhuset ska nyttja plattformen
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Företaget som är kopplat till varuhuset
    /// </summary>
    public Company Company { get; set; } = null!;

    /// <summary>
    /// Lista med användare kopplade till varuhuset
    /// </summary>
    public ICollection<User> Users { get; set; } = new List<User>();

    /// <summary>
    /// Lista med ordrar kopplade till varuhuset
    /// </summary>
    public ICollection<Order> Orders { get; set; } = new List<Order>();

    /// <summary>
    /// Lista med budgets kopplade till varuhuset
    /// </summary>
    public ICollection<Budget> Budgets { get; set; } = new List<Budget>();
}
