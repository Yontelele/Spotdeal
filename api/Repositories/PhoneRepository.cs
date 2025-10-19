using api.Context;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories;

/// <summary>
/// Databas operationer för telefoner
/// </summary>
public class PhoneRepository(AbonnemangDbContext dbContext)
{
    private readonly AbonnemangDbContext dbContext = dbContext;

    /// <summary>
    /// Hämtar alla telefoner från databasen
    /// </summary>
    /// <returns>Lista med telefoner</returns>
    public async Task<List<Phone>> GetAllPhonesFromDatabase()
    {
        return await dbContext.Phones
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Hämtar en telefon baserat på Id
    /// </summary>
    /// <param name="phoneId">Id på telefonen</param>
    /// <returns>Telefonen om den hittas, annars null</returns>
    public async Task<Phone?> GetPhoneByIdFromDatabase(int phoneId)
    {
        return await dbContext.Phones
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == phoneId);
    }

    /// <summary>
    /// Hämtar telefoner baserat på en lista med ID:n
    /// </summary>
    /// <param name="phoneIds">Lista med telefon-ID:n att hämta.</param>
    /// <returns>En lista med telefoner som matchar de angivna ID:n.</returns>
    public async Task<List<Phone>> GetPhonesByIdsFromDatabase(List<int> phoneIds)
    {
        return await dbContext.Phones
            .Where(p => phoneIds.Contains(p.Id))
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Hämtar telefoner baserat på en lista med ID:n
    /// </summary>
    /// <param name="phoneIds">Lista med telefon-ID:n att hämta.</param>
    /// <returns>En dictionary med telefoner som matchar de angivna ID:n.</returns>
    public async Task<Dictionary<int, Phone>> GetPhonesByIdsFromDatabaseToDictionary(List<int> phoneIds)
    {
        return await dbContext.Phones
            .Where(p => phoneIds.Contains(p.Id))
            .AsNoTracking()
            .ToDictionaryAsync(p => p.Id);
    }

    /// <summary>
    /// Hämtar en lista med den valda telefonens alla färger
    /// </summary>
    /// <param name="phone">Den valda telefonen</param>
    /// <returns>Lista med telefonens alla färger</returns>
    public async Task<List<Phone>> GetAllColorsOnPhoneFromDatabase(Phone phone)
    {
        return await dbContext.Phones
            .Where(p => p.Model == phone.Model && p.Storage == phone.Storage)
            .AsNoTracking()
            .ToListAsync();
    }
}
