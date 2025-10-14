using api.Context;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories;

/// <summary>
/// Databas operationer för kontraktskoder
/// </summary>
public class ContractCodesRepository(AbonnemangDbContext dbContext)
{
    private readonly AbonnemangDbContext dbContext = dbContext;

    /// <summary>
    /// Hämtar alla kontraktkoder som tillhör operatören
    /// </summary>
    /// <param name="operatorId">Id på operatören</param>
    /// <returns>Lista med kontraktkoder tillhörande operatören</returns>
    public async Task<List<ContractCode>> GetContractCodesFromDatabase(int operatorId)
    {
        return await dbContext.ContractCodes
            .Where(c => c.OperatorId == operatorId)
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Hämtar alla delbetalningskoder som tillhör operatören
    /// </summary>
    /// <param name="operatorId">Id på operatören</param>
    /// <returns>Dictionary med delbetalningskoder tillhörande operatören</returns>
    public async Task<Dictionary<int, Delbetalningskod>> GetDelbetalningskodFromDatabaseToDictionary(int operatorId)
    {
        return await dbContext.Delbetalningskoder
            .Where(d => d.OperatorId == operatorId)
            .AsNoTracking()
            .ToDictionaryAsync(d => d.TotalCost);
    }


    /// <summary>
    /// Hämtar subventioner för abonnemang baserat på en lista med abonnemang-ID:n.
    /// </summary>
    /// <param name="abonnemangIds">Lista med abonnemang-ID:n att hämta subventioner för.</param>
    /// <returns>En dictionary med abonnemang-ID som nyckel och lista med subventionskoder som värde.</returns>
    public async Task<Dictionary<int, List<Subventionskod>>> GetAbonnemangSubventionsFromDatabase(List<int> abonnemangIds)
    {
        DateOnly today = DateOnly.FromDateTime(DateTime.Today);
        var abonnemangSubventions = await dbContext.Subventionskopplingar
            .Where(k => abonnemangIds.Contains(k.AbonnemangId) && k.PhoneId == null && k.Subventionskod.IsActive && today >= k.Subventionskod.ValidFrom && today <= k.Subventionskod.ValidTo)
            .Select(k => new { k.AbonnemangId, k.Subventionskod })
            .ToListAsync();

        return abonnemangSubventions
            .GroupBy(s => s.AbonnemangId)
            .ToDictionary(g => g.Key, g => g.Select(s => s.Subventionskod).ToList());
    }

    /// <summary>
    /// Hämtar subventioner för abonnemang kombinerat med telefoner baserat på en lista med abonnemang-ID:n och telefon-ID:n.
    /// </summary>
    /// <param name="abonnemangIds">Lista med abonnemang-ID:n att hämta subventioner för.</param>
    /// <param name="phoneIds">Lista med telefon-ID:n att hämta subventioner för.</param>
    /// <returns>En dictionary med en tuple (abonnemang-ID, telefon-ID) som nyckel och lista med subventionskoder som värde.</returns>
    public async Task<Dictionary<(int, int), List<Subventionskod>>> GetPhoneBundleSubventionsFromDatabase(List<int> abonnemangIds, List<int> phoneIds)
    {
        DateOnly today = DateOnly.FromDateTime(DateTime.Today);
        var phoneBundleSubventions = await dbContext.Subventionskopplingar
            .Where(sk => abonnemangIds.Contains(sk.AbonnemangId) && sk.PhoneId != null && phoneIds.Contains(sk.PhoneId.Value) && sk.Subventionskod.IsActive && today >= sk.Subventionskod.ValidFrom && today <= sk.Subventionskod.ValidTo)
            .Select(sk => new { sk.AbonnemangId, PhoneId = sk.PhoneId!.Value, sk.Subventionskod })
            .ToListAsync();

        return phoneBundleSubventions
            .GroupBy(s => (s.AbonnemangId, s.PhoneId))
            .ToDictionary(g => g.Key, g => g.Select(s => s.Subventionskod).ToList());
    }
}
