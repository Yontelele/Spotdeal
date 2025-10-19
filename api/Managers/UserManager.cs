using api.AdminDto;
using api.Dto;
using api.Enums;
using api.Helpers;
using api.Models;
using api.Repositories;
using AutoMapper;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace api.Managers;

/// <summary>
/// Hanterar logik för användare
/// </summary>
public class UserManager(UserRepository userRepository, StoreRepository storeRepository, ILogger<UserManager> logger, IMapper mapper, OrderRepository orderRepository)
{
    private readonly UserRepository userRepository = userRepository;
    private readonly StoreRepository storeRepository = storeRepository;
    private readonly ILogger<UserManager> logger = logger;
    private readonly IMapper mapper = mapper;
    private readonly OrderRepository orderRepository = orderRepository;

    /// <summary>
    /// Hämtar inloggad användare via token
    /// </summary>
    /// <param name="claimsPrincipal">Token för inloggad användare</param>
    /// <returns>Användaren om den hittas, annars null</returns>
    public async Task<User?> GetUser(ClaimsPrincipal claimsPrincipal)
    {
        string? userEmail = claimsPrincipal.FindFirstValue(ClaimTypes.Upn) ?? claimsPrincipal.FindFirstValue(ClaimTypes.Email);

        if (string.IsNullOrEmpty(userEmail))
        {
            logger.LogWarning("Kunde inte hämta användarens e-post från token");
            return null;
        }

        User? user = await userRepository.GetUserByEmailFromDatabase(userEmail);
        if (user is null) return null;
        
        return user;
    }

    /// <summary>
    /// Hämtar information om den inloggade användaren och beräknar intjänad provision för nuvarande månaden.
    /// </summary>
    /// <param name="user">Användaren</param>
    /// <returns>Information om användaren som en DTO</returns>
    public async Task<UserDto> GetUserDto(User user)
    {
        int year = DateTimeHelper.GetSwedishTime().Year;
        int month = DateTimeHelper.GetSwedishTime().Month;

        DateTime startOfMonth = new DateTime(year, month, 1);
        DateTime endOfMonth = startOfMonth.AddMonths(1).AddSeconds(-1);

        int provision = await orderRepository.GetProvisionForUserFromDatabase(startOfMonth, endOfMonth, user.Id);

        UserDto userDto = mapper.Map<UserDto>(user);
        userDto.Provision = provision;

        await UpdateUserLastLogin(user.Id);
        return userDto;
    }

    /// <summary>
    /// Hämtar alla användare
    /// </summary>
    /// <returns>En lista med alla användare</returns>
    /// <exception cref="InvalidOperationException">Kastas om inga användare hittas i databasen.</exception>
    public async Task<List<User>> GetAllUsers()
    {
        List<User> users = await userRepository.GetAllUsersFromDatabase();
        if (!users.Any()) throw new InvalidOperationException("Tekniskt fel: Inga användare hittades i systemet.");

        return users;
    }

    /// <summary>
    /// Hämtar en specifik användare med tillhörande information
    /// </summary>
    /// <param name="id">ID kopplat till användare som ska hämtas</param>
    /// <returns>Användaren med tillhörande information, eller null om användaren inte finns</returns>
    /// <exception cref="KeyNotFoundException">Kastas när användaren inte hittas</exception>
    public async Task<User> GetUserById(int id)
    {
        User user = await userRepository.GetUserByIdFromDatabase(id) ?? throw new KeyNotFoundException($"Användaren med ID: {id} hittades inte i systemet.");
        return user;
    }

    /// <summary>
    /// Skapar en ny användare i systemet och kopplar till ett varuhus.
    /// </summary>
    /// <param name="newUser">Användardata som skickas från frontend</param>
    /// <returns>Den nyskapade användaren som sparats i databasen</returns>
    /// <exception cref="ArgumentNullException">Kastas när userToCreate är null eller obligatoriska fält (FirstName, LastName, Email) är tomma</exception>
    /// <exception cref="ValidationException">Kastas när rollen är ogiltig eller en användare med samma e-postadress redan existerar</exception>
    /// <exception cref="KeyNotFoundException">Kastas när det angivna StoreId inte finns i systemet</exception>
    public async Task<User> CreateUser(NewUserDto newUser)
    {
        if (newUser is null) throw new ArgumentNullException(nameof(newUser));
        if (string.IsNullOrWhiteSpace(newUser.FirstName)) throw new ArgumentNullException(nameof(newUser.FirstName), "Förnamn är obligatoriskt.");
        if (string.IsNullOrWhiteSpace(newUser.LastName)) throw new ArgumentNullException(nameof(newUser.LastName), "Efternamn är obligatoriskt.");
        if (string.IsNullOrWhiteSpace(newUser.Email)) throw new ArgumentNullException(nameof(newUser.Email), "Email är obligatoriskt.");
        if (HasUserValidRole(newUser.Role) is false) throw new ValidationException("En giltig roll är obligatoriskt.");
        if (await userRepository.GetUserByEmailFromDatabase(newUser.Email) is not null) throw new ValidationException("En användare med den e‑postadressen existerar redan.");
        if (await storeRepository.GetStoreByIdFromDatabase(newUser.StoreId) is null) throw new KeyNotFoundException($"Varuhus med ID: {newUser.StoreId} hittades inte i systemet.");

        User user = new User
        {
            FirstName = newUser.FirstName,
            LastName = newUser.LastName,
            Email = newUser.Email,
            Role = newUser.Role,
            IsActive = newUser.IsActive,
            StoreId = newUser.StoreId
        };

        await userRepository.AddUserToDatabase(user);
        return user;
    }

    /// <summary>
    /// Uppdaterar senaste inloggningstid för en användare.
    /// </summary>
    /// <param name="userId">ID för användaren</param>
    /// <returns>True om uppdateringen lyckades, annars false</returns>
    public async Task<bool> UpdateUserLastLogin(int userId)
    {
        try
        {
            bool success = await userRepository.UpdateUserLastLogin(userId);
            if (!success) logger.LogWarning($"Kunde inte uppdatera senaste inloggning för användare {userId}");
            
            return success;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"Ett fel uppstod vid uppdatering av senaste inloggning för användare {userId}");
            return false;
        }
    }

    /// <summary>
    /// Kontrollerar om användaren är chef
    /// </summary>
    /// <param name="user">Användaren</param>
    /// <returns>True om användaren är chef</returns>
    public bool IsUserManager(User user)
    {
        return user.Role == UserRole.Manager;
    }

    /// <summary>
    /// Kontrollerar om användaren är admin
    /// </summary>
    /// <param name="user">Användaren</param>
    /// <returns>True om användaren är admin</returns>
    public bool IsUserAdmin(User user)
    {
        return user.Role == UserRole.Admin;
    }

    /// <summary>
    /// Kontrollerar om användaren är chef eller admin
    /// </summary>
    /// <param name="user">Användaren</param>
    /// <returns>True om användaren är chef eller admin</returns>
    public bool IsUserManagerOrAdmin(User user)
    {
        return user.Role == UserRole.Admin || user.Role == UserRole.Manager;
    }

    /// <summary>
    /// Kontrollerar om användaren har en giltig roll
    /// </summary>
    /// <param name="role">Rollen som ska kontrolleras</param>
    /// <returns>True om användaren har en giltig roll</returns>
    public bool HasUserValidRole(UserRole role)
    {
        return role == UserRole.Sales || role == UserRole.Manager || role == UserRole.Admin;
    }
}
