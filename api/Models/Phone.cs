using System.ComponentModel.DataAnnotations;

namespace api.Models;

/// <summary>
/// Databastabell för alla telefoner
/// </summary>
public class Phone : BaseEntity
{
    /// <summary>
    /// Företaget som skapat telefonen
    /// </summary>
    [Required, StringLength(50)]
    public string Brand { get; set; } = string.Empty;

    /// <summary>
    /// Modellnamnet på telefonen
    /// </summary>
    [Required, StringLength(50)]
    public string Model { get; set; } = string.Empty;

    /// <summary>
    /// Lagringskapacitet på telefonen
    /// </summary>
    [Required, StringLength(20)]
    public string Storage { get; set; } = string.Empty;

    /// <summary>
    /// Färg på telefonen
    /// </summary>
    [Required, StringLength(50)]
    public string Color { get; set; } = string.Empty;

    /// <summary>
    /// Pris på telefonen
    /// </summary>
    [Required]
    public int Price { get; set; }

    /// <summary>
    /// URL till telefonens bild
    /// </summary>
    [StringLength(200)]
    public string Img { get; set; } = string.Empty;

    /// <summary>
    /// Kod kopplad till telefonen <br/>
    /// Denna kod kopieras och läggs in i säljsystemet
    /// </summary>
    [Required, StringLength(20)]
    public string Code { get; set; } = string.Empty;
}
