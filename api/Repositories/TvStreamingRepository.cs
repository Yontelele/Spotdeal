using api.Context;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories;

/// <summary>
/// Databas operationer för TV och Streaming paket
/// </summary>
public class TvStreamingRepository(AbonnemangDbContext dbContext)
{
    private readonly AbonnemangDbContext dbContext = dbContext;

    /// <summary>
    /// Hämtar alla TV och Streaming paket från databasen
    /// </summary>
    /// <returns>Lista med TV och Streaming paket</returns>
    public async Task<List<TvStreaming>> GetAllTvStreamingFromDatabase()
    {
        return await dbContext.TvStreaming
            .Include(t => t.Operator)
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Hämtar alla TV och Streaming paket från databasen kopplat till den valda operatören
    /// </summary>
    /// <returns>Lista med TV och Streaming paket</returns>
    public async Task<List<TvStreaming>> GetAllTvStreamingFromDatabaseByOperator(int operatorId)
    {
        return await dbContext.TvStreaming
            .Include(t => t.Operator)
            .Where(t => t.OperatorId == operatorId)
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Hämtar ett TV och Streaming paket baserat på ID
    /// </summary>
    /// <param name="tvStreamingId">ID på TV och Streaming paketet</param>
    /// <returns>Ett TV och Streaming paket</returns>
    public async Task<TvStreaming?> GetTvStreamingByIdFromDatabase(int tvStreamingId)
    {
        return await dbContext.TvStreaming
            .Include(t => t.Operator)
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == tvStreamingId);
    }
}
