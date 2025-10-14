using api.Enums;

namespace api.AdminDto;

/// <summary>
/// Användardata som skickas från frontend vid skapande av en ny användare.
/// </summary>
public class NewUserDto
{
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
    /// Id kopplat till användarens arbetsplats
    /// </summary>
    public int StoreId { get; set; }
}
