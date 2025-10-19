using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace api.Models;

/// <summary>
/// Basklass för entiteter som har Id och Tidsstämplar
/// </summary>
public abstract class BaseEntity
{
    /// <summary>
    /// Primärnyckel som tilldelas av databasen
    /// </summary>
    [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    /// <summary>
    /// Tidsstämpel på när entiteten blev skapad
    /// </summary>
    [Required]
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Tidsstämpel på när entiteten senast blev uppdaterad
    /// </summary>
    [Required]
    public DateTime UpdatedAt { get; set; } 
}
