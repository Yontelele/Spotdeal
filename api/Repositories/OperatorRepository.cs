using api.Context;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories;

/// <summary>
/// Databas operationer för operatör
/// </summary>
public class OperatorRepository(AbonnemangDbContext dbContext)
{
    private readonly AbonnemangDbContext dbContext = dbContext;

    /// <summary>
    /// Hämtar alla operatörer från databasen
    /// </summary>
    public async Task<List<Operator>> GetAllOperatorsFromDatabase()
    {
        return await dbContext.Operators
            .AsNoTracking()
            .ToListAsync();
    }
}

