using api.Context;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories;

/// <summary>
/// Databas operationer för spotdeals
/// </summary>
public class SpotDealRepository(AbonnemangDbContext dbContext)
{
    private readonly AbonnemangDbContext dbContext = dbContext;

    /// <summary>
    /// Hämtar alla spotdeals
    /// </summary>
    /// <returns>Alla spotdeals från databasen</returns>
    public async Task<List<SpotDeal>> GetAllSpotDealsFromDatabase()
    {
        return await dbContext.SpotDeals
            .Include(s => s.Phone)
            .Include(s => s.Abonnemang).ThenInclude(a => a.Operator)
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Hämtar alla spotdeals kopplat till en specifik telefon
    /// </summary>
    /// <param name="phoneId">ID på telefonen</param>
    /// <returns>Alla spotdeals kopplat till telefonen</returns>
    public async Task<List<SpotDeal>> GetSpotdealsByPhoneIdFromDatabase(int phoneId)
    {
        return await dbContext.SpotDeals
            .Where(s  => s.PhoneId == phoneId)
            .Include(s => s.Phone)
            .Include(s => s.Abonnemang).ThenInclude(a => a.Operator)
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Sparar spotdeals i databasen
    /// </summary>
    /// <param name="spotDeals">En lista med spotdeals som ska sparas</param>
    public async Task AddSpotDealsToDatabase(List<SpotDeal> spotDeals)
    {
        using (var transaction = await dbContext.Database.BeginTransactionAsync())
        {
            try
            {
                await dbContext.SpotDeals.AddRangeAsync(spotDeals);
                await dbContext.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }

    /// <summary>
    /// Hämtar alla spotdeals kopplat till en specifik telefon och abonnemang
    /// </summary>
    /// <param name="abonnemangIds">Lista med alla abonnemangs ID:n</param>
    /// <param name="phones">Lista med alla färger på den valda telefonen</param>
    /// <returns>Lista med alla spotdeals kopplat till telefonen och abonnemanget</returns>
    public async Task<List<SpotDeal>> GetSpotdealsByAbonnemangAndPhoneFromDatabase(List<int> abonnemangIds, List<Phone> phones)
    {
        List<int> phoneIds = phones.Select(p => p.Id).ToList();
        return await dbContext.SpotDeals
            .Where(sd => abonnemangIds.Contains(sd.AbonnemangId) && phoneIds.Contains(sd.PhoneId))
            .ToListAsync();
    }

    /// <summary>
    /// Raderar spotdeals i databasen
    /// </summary>
    /// <param name="spotDeals">En lista med spotdeals som ska raderas</param>
    public async Task DeleteSpotdealsFromDatabase(List<SpotDeal> spotDeals)
    {
        using (var transaction = await dbContext.Database.BeginTransactionAsync())
        {
            try
            {
                dbContext.SpotDeals.RemoveRange(spotDeals);
                await dbContext.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}
