using api.Enums;

namespace api.Dto;

/// <summary>
/// Användardata som skickas till frontend vid lyckad autentisering
/// </summary>
public class UserDto
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
    /// Användarens jobbtitel
    /// </summary>
    public UserRole Role { get; set; }

    /// <summary>
    /// Id kopplat till användarens arbetsplats
    /// </summary>
    public int StoreId { get; set; }

    /// <summary>
    /// Antal sålda abonnemang
    /// </summary>
    public int AbonnemangSold { get; set; }

    /// <summary>
    /// Antal sålda fokusabonnemang
    /// </summary>
    public int FokusAbonnemangSold { get; set; }

    /// <summary>
    /// Antal sålda bredband
    /// </summary>
    public int BredbandSold { get; set; }

    /// <summary>
    /// Antal sålda Tv och streaming-paket
    /// </summary>
    public int TvStreamingSold { get; set; }

    /// <summary>
    /// Provision som användaren tjänat ihop nuvarande månad
    /// </summary>
    public int Provision { get; set; }

    /// <summary>
    /// Användarens arbetsplats
    /// </summary>
    public StoreDto Store { get; set; } = null!;
}
