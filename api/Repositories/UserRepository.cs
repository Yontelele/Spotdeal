using api.Context;
using api.Helpers;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories;

/// <summary>
/// Databas operationer för användare
/// </summary>
public class UserRepository(AbonnemangDbContext dbContext)
{
    private readonly AbonnemangDbContext dbContext = dbContext;

    /// <summary>
    /// Hämtar en användare baserat på användar-ID
    /// </summary>
    /// <param name="userId">ID för användaren</param>
    /// <returns>Användaren om den hittas, annars null</returns>
    public async Task<User?> GetUserByIdFromDatabase(int userId)
    {
        return await dbContext.Users
            .Include(u => u.Store).ThenInclude(s => s.Company)
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId && u.IsActive);
    }

    /// <summary>
    /// Hämtar alla användare från databasen
    /// </summary>
    /// <returns>Lista med alla användare</returns>
    public async Task<List<User>> GetAllUsersFromDatabase()
    {
        return await dbContext.Users
            .Include(u => u.Store).ThenInclude(s => s.Company)
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Hämtar en användare baserat på e-postadress
    /// </summary>
    /// <param name="userEmail">E-postadress för användaren</param>
    /// <returns>Användaren om den hittas, annars null</returns>
    public async Task<User?> GetUserByEmailFromDatabase(string userEmail)
    {
        return await dbContext.Users
            .Include(u => u.Store).ThenInclude(s => s.Company)
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email.ToLower() == userEmail.ToLower() && u.IsActive);
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="user"></param>
    /// <returns></returns>
    public async Task AddUserToDatabase(User user)
    {
        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync();
    }

    /// <summary>
    /// Uppdaterar användaren med nya värden i databasen
    /// </summary>
    /// <param name="user">Användaren som ska uppdateras</param>
    public async Task UpdateUserInDatabase(User user)
    {
        dbContext.Users.Update(user);
        await dbContext.SaveChangesAsync();
    }

    /// <summary>
    /// Uppdaterar senaste inloggningstid för en användare.
    /// </summary>
    /// <param name="userId">ID för användaren.</param>
    /// <returns>True om uppdateringen lyckades, annars false</returns>
    public async Task<bool> UpdateUserLastLogin(int userId)
    {
        try
        {
            var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId && u.IsActive);
            if (user is null) return false;

            user.LastLogin = DateTimeHelper.GetSwedishTime();
            await dbContext.SaveChangesAsync();

            return true;
        }
        catch
        {
            return false;
        }
    }

    /// <summary>
    /// Hämtar alla användare kopplat till ett varuhus
    /// </summary>
    /// <param name="storeId">ID för varuhuset</param>
    /// <returns>Lista med användare</returns>
    public async Task<List<User>> GetUsersByVaruhusFromDatabase(int storeId)
    {
        return await dbContext.Users
            .Include(u => u.Store).ThenInclude(s => s.Company)
            .Where(u => u.StoreId == storeId)
            .AsNoTracking()
            .ToListAsync();
    }
}
