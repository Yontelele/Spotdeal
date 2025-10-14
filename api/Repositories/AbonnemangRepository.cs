using api.Context;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories;

/// <summary>
/// Databas operationer för abonnemang
/// </summary>
public class AbonnemangRepository(AbonnemangDbContext dbContext)
{
    private readonly AbonnemangDbContext dbContext = dbContext;

    /// <summary>
    /// Hämtar alla abonnemang från databasen
    /// </summary>
    /// <returns>Lista med abonnemang</returns>
    public async Task<List<Abonnemang>> GetAllAbonnemangsFromDatabase()
    {
        return await dbContext.Abonnemang
            .Include(a => a.Operator)
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Hämtar alla abonnemang från databasen som ska synas i lathunden eller mobildeal
    /// </summary>
    /// <returns>Lista med abonnemang</returns>
    public async Task<List<Abonnemang>> GetAbonnemangsInLathundOrMobilDealFromDatabase()
    {
        return await dbContext.Abonnemang
            .Include(a => a.Operator)
            .Where(a => a.ShowInTable || a.ShowInMobilDeal)
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Hämtar alla abonnemang från databasen kopplat till den valda operatören
    /// </summary>
    /// <returns>Lista med abonnemang</returns>
    public async Task<List<Abonnemang>> GetAllAbonnemangsFromDatabaseByOperator(int operatorId)
    {
        return await dbContext.Abonnemang
            .Include(a => a.Operator)
            .Where(a => a.OperatorId == operatorId)
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Hämtar alla abonnemang som matchar med listan av IDn
    /// </summary>
    /// <param name="abonnemangIds">Lista med IDn</param>
    /// <returns>Abonnemang som dictionary</returns>
    public async Task<Dictionary<int, Abonnemang>> GetAbonnemangByIdsFromDatabaseToDictionary(List<int> abonnemangIds)
    {
        return await dbContext.Abonnemang
            .Include(a => a.Operator)
            .Where(a => abonnemangIds.Contains(a.Id))
            .AsNoTracking()
            .ToDictionaryAsync(a => a.Id);
    }

    /// <summary>
    /// Hämtar alla abonnemang som matchar med listan av IDn
    /// </summary>
    /// <param name="abonnemangIds">Lista med IDn</param>
    /// <returns>Lista med abonnemang</returns>
    public async Task<List<Abonnemang>> GetAbonnemangByIdsFromDatabase(List<int> abonnemangIds)
    {
        return await dbContext.Abonnemang
            .Include(a => a.Operator)
            .Where(a => abonnemangIds.Contains(a.Id))
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Hämtar alla abonnemang som matchar med listan av IDn
    /// </summary>
    /// <param name="abonnemangIds">Lista med IDn</param>
    /// <returns>Lista med abonnemang</returns>
    public async Task<List<Abonnemang>> GetAbonnemangByIdsToUpdateFromDatabase(List<int> abonnemangIds)
    {
        return await dbContext.Abonnemang
            .Include(a => a.Operator)
            .Where(a => abonnemangIds.Contains(a.Id))
            .ToListAsync();
    }

    /// <summary>
    /// Hämtar alla huvud-abonnemang från databasen
    /// </summary>
    /// <returns>Lista med huvud-abonnemang</returns>
    public async Task<List<Abonnemang>> GetAllHuvudAbonnemangFromDatabase()
    {
        return await dbContext.Abonnemang
            .Include(a => a.Operator)
            .Where(a => a.IsHuvudAbonnemang && !a.IsBefintligtAbonnemang && !a.IsForDelbetalningOnly && !a.IsUngdomsAbonnemang && a.IsFokus)
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Hämtar alla abonnemang som ska synas i mobildeal från databasen
    /// </summary>
    /// <returns>Lista med abonnemang som ska synas i mobildeal</returns>
    public async Task<List<Abonnemang>> GetAllMobilDealAbonnemangFromDatabase()
    {
        return await dbContext.Abonnemang
            .Include(a => a.Operator)
            .Where(a => a.ShowInMobilDeal)
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Hämtar ett abonnemang baserat på ID
    /// </summary>
    /// <param name="abonnemangId">ID på abonnemanget</param>
    /// <returns>Ett abonnemang</returns>
    public async Task<Abonnemang?> GetAbonnemangByIdFromDatabase(int abonnemangId)
    {
        return await dbContext.Abonnemang
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == abonnemangId);
    }

    /// <summary>
    /// Hämtar ett delbetalningsabonnemang
    /// </summary>
    /// <param name="abonnemang">Abonnemanget som har ett delbetalningsabonnemang</param>
    /// <returns>Ett delbetalningsabonnemang</returns>
    public async Task<Abonnemang?> GetDelbetalningsAbonnemangFromDatabase(Abonnemang abonnemang)
    {
        return await dbContext.Abonnemang
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.OperatorId == abonnemang.OperatorId && a.MonthlyPrice == abonnemang.MonthlyPrice && a.IsForDelbetalningOnly && !a.IsUngdomsAbonnemang);
    }

    /// <summary>
    /// Hämtar ett ungdomsabonnemang
    /// </summary>
    /// <param name="abonnemang">Abonnemanget som har ett ungdomsabonnemang</param>
    /// <returns>Ett ungdomsabonnemang</returns>
    public async Task<Abonnemang?> GetUngdomsAbonnemangFromDatabase(Abonnemang abonnemang)
    {
        return await dbContext.Abonnemang
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.OperatorId == abonnemang.OperatorId && a.MonthlyPrice == abonnemang.MonthlyPrice - 50 && a.IsUngdomsAbonnemang && !a.IsForDelbetalningOnly && a.IsFokus);
    }

    /// <summary>
    /// Hämtar ett ungdoms-delbetalningsabonnemang
    /// </summary>
    /// <param name="abonnemang">Ungdomsabonnemanget som har ett delbetalningsabonnemang</param>
    /// <returns>Ett ungdoms-delbetalningsabonnemang</returns>
    public async Task<Abonnemang?> GetUngdomsDelbetalningsAbonnemangFromDatabase(Abonnemang abonnemang)
    {
        return await dbContext.Abonnemang
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.OperatorId == abonnemang.OperatorId && a.MonthlyPrice == abonnemang.MonthlyPrice && a.IsUngdomsAbonnemang && a.IsForDelbetalningOnly);
    }

    /// <summary>
    /// Hämtar ett student abonnemang
    /// </summary>
    /// <param name="abonnemang">Abonnemanget som har ett studentabonnemang</param>
    /// <returns>Ett studentabonnemang</returns>
    public async Task<Abonnemang?> GetStudentAbonnemangFromDatabase(Abonnemang abonnemang)
    {
        return await dbContext.Abonnemang
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.OperatorId == abonnemang.OperatorId && a.Surf == abonnemang.Surf && a.IsUngdomsAbonnemang && !a.IsForDelbetalningOnly && a.IsFokus);
    }

    /// <summary>
    /// Hämtar en lista med ID:n på relaterade extra användare
    /// </summary>
    /// <param name="extraAnvandare">Abonnemanget som har relaterade extra användare</param>
    /// <returns>En lista med ID:n</returns>
    public async Task<List<int>> GetRelatedExtraAnvandareIdsFromDatabase(Abonnemang extraAnvandare)
    {
        return await dbContext.Abonnemang
            .AsNoTracking()
            .Where(a => a.OperatorId == extraAnvandare.OperatorId && a.TableName == extraAnvandare.TableName && a.IsHuvudAbonnemang == false && a.Id != extraAnvandare.Id).Select(a => a.Id).ToListAsync();
    }

    /// <summary>
    /// Uppdaterar abonnemang med nya värden i databasen
    /// </summary>
    /// <param name="abonnemangs">En lista med abonnemang som ska uppdateras</param>
    public async Task UpdateAbonnemangInDatabase(List<Abonnemang> abonnemangs)
    {
        using (var transaction = await dbContext.Database.BeginTransactionAsync())
        {
            try
            {
                dbContext.Abonnemang.UpdateRange(abonnemangs);
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