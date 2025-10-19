using api.Context;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories;

/// <summary>
/// Databas operationer för varuhus
/// </summary>
public class StoreRepository(AbonnemangDbContext dbContext)
{
    private readonly AbonnemangDbContext dbContext = dbContext;

    /// <summary>
    /// Hämtar ett varuhus baserat på varuhus-ID
    /// </summary>
    /// <param name="storeId">ID för varuhuset</param>
    /// <returns>Varuhuset om det hittas, annars null</returns>
    public async Task<Store?> GetStoreByIdFromDatabase(int storeId)
    {
        return await dbContext.Stores
            .Include(s => s.Company)
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Id == storeId);
    }
}
