using api.Dto;
using api.Enums;

namespace api.AdminDto;

/// <summary>
/// Användardata som skickas till admin–frontend
/// </summary>
public class AdminUserDto
{
    /// <summary>
    /// Användarens id
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Användarens förnamn
    /// </summary>
    public string FirstName { get; set; } = string.Empty;

    /// <summary>
    /// Användarens efternamn
    /// </summary>
    public string LastName { get; set; } = string.Empty;

    /// <summary>
    /// Användarens mailadress
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Användarens jobbtitel
    /// </summary>
    public UserRole Role { get; set; }

    /// <summary>
    /// Användarens status
    /// </summary>
    public bool IsActive { get; set; }

    /// <summary>
    /// Tidsstämpel på när användaren senast loggade in
    /// </summary>
    public DateTime? LastLogin { get; set; }

    /// <summary>
    /// Tidsstämpel på när användaren blev skapad
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Id kopplat till användarens arbetsplats
    /// </summary>
    public int StoreId { get; set; }

    /// <summary>
    /// Användarens arbetsplats
    /// </summary>
    public StoreDto Store { get; set; } = null!;
}
