using api.Context;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories;

/// <summary>
/// Databas operationer för bredband
/// </summary>
public class BredbandRepository(AbonnemangDbContext dbContext)
{
    private readonly AbonnemangDbContext dbContext = dbContext;

    /// <summary>
    /// Hämtar alla bredband från databasen
    /// </summary>
    /// <returns>Lista med bredband</returns>
    public async Task<List<Bredband>> GetAllBredbandsFromDatabase()
    {
        return await dbContext.Bredband
            .Include(b => b.Operator)
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Hämtar alla bredband från databasen kopplat till den valda operatören
    /// </summary>
    /// <returns>Lista med bredband</returns>
    public async Task<List<Bredband>> GetAllBredbandsFromDatabaseByOperator(int operatorId)
    {
        return await dbContext.Bredband
            .Include(b => b.Operator)
            .Where(b => b.OperatorId == operatorId)
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Hämtar ett bredband baserat på ID
    /// </summary>
    /// <param name="bredbandId">ID på bredbandet</param>
    /// <returns>Ett bredband</returns>
    public async Task<Bredband?> GetBredbandByIdFromDatabase(int bredbandId)
    {
        return await dbContext.Bredband
            .Include(b => b.Operator)
            .AsNoTracking()
            .FirstOrDefaultAsync(b => b.Id == bredbandId);
    }
}
