using api.Context;
using api.Dto;
using api.Enums;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories;

/// <summary>
/// Databas operationer för ordrar
/// </summary>
public class OrderRepository(AbonnemangDbContext dbContext)
{
    private readonly AbonnemangDbContext dbContext = dbContext;

    /// <summary>
    /// Hämtar en specifik order med tillhörande information
    /// </summary>
    /// <param name="id">ID för ordern som ska hämtas</param>
    /// <returns>Ordern med tillhörande information, eller null om ordern inte finns</returns>
    public async Task<Order?> GetOrderByIdFromDatabase(int id)
    {
        return await dbContext.Orders
            .Include(o => o.Contracts).ThenInclude(c => c.Abonnemang!).ThenInclude(a => a.Operator)
            .Include(o => o.Contracts).ThenInclude(c => c.Bredband!).ThenInclude(a => a.Operator)
            .Include(o => o.Contracts).ThenInclude(c => c.TvStreaming!).ThenInclude(a => a.Operator)
            .Include(o => o.Contracts).ThenInclude(c => c.CancelledByUser)
            .Include(o => o.User)
            .Include(o => o.Store).ThenInclude(s => s.Company)
            .AsNoTracking()
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    /// <summary>
    /// Hämtar ordrar för ett specifikt varuhus inom ett datumintervall
    /// </summary>
    /// <param name="storeId">ID för varuhuset</param>
    /// <param name="from">Startdatum för intervallet</param>
    /// <param name="to">Slutdatum för intervallet</param>
    /// <returns>Lista med ordrar</returns>
    public async Task<List<Order>> GetOrdersByTimeFromDatabase(DateTime from, DateTime to, int storeId)
    {
        return await dbContext.Orders
            .Include(o => o.Contracts).ThenInclude(c => c.Abonnemang!).ThenInclude(a => a.Operator)
            .Include(o => o.Contracts).ThenInclude(c => c.Bredband!).ThenInclude(b => b.Operator)
            .Include(o => o.Contracts).ThenInclude(c => c.TvStreaming!).ThenInclude(t => t.Operator)
            .Include(o => o.Contracts).ThenInclude(c => c.CancelledByUser)
            .Include(o => o.User)
            .Include(o => o.Store).ThenInclude(s => s.Company)
            .Where(o => o.CreatedAt.Date >= from.Date && o.CreatedAt.Date <= to.Date && o.StoreId == storeId)
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Hämtar kontrakt för ett specifikt varuhus inom ett datumintervall
    /// </summary>
    /// <param name="storeId">ID för varuhuset</param>
    /// <param name="from">Startdatum för intervallet</param>
    /// <param name="to">Slutdatum för intervallet</param>
    /// <returns>Lista med kontrakt</returns>
    public async Task<List<Contract>> GetContractsByTimeFromDatabase(DateTime from, DateTime to, int storeId)
    {
        return await dbContext.Contracts
            .Include(c => c.Abonnemang!).ThenInclude(a => a.Operator)
            .Include(c => c.Bredband!).ThenInclude(b => b.Operator)
            .Include(c => c.TvStreaming!).ThenInclude(t => t.Operator)
            .Include(c => c.CancelledByUser)
            .Include(c => c.Order).ThenInclude(o => o.User)
            .Include(c => c.Order).ThenInclude(o => o.Store).ThenInclude(s => s.Company)
            .Where(c => c.CreatedAt.Date >= from.Date && c.CreatedAt.Date <= to.Date && c.Order.StoreId == storeId)
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Hämtar makulerade ordrar för ett specifikt varuhus inom ett datumintervall
    /// </summary>
    /// <param name="storeId">ID för varuhuset</param>
    /// <param name="from">Startdatum för intervallet</param>
    /// <param name="to">Slutdatum för intervallet</param>
    /// <returns>Lista med makulerade ordrar</returns>
    public async Task<List<Order>> GetCancelledOrdersByTimeFromDatabase(DateTime from, DateTime to, int storeId)
    {
        return await dbContext.Orders
            .Include(o => o.Contracts).ThenInclude(c => c.Abonnemang!).ThenInclude(a => a.Operator)
            .Include(o => o.Contracts).ThenInclude(c => c.Bredband!).ThenInclude(b => b.Operator)
            .Include(o => o.Contracts).ThenInclude(c => c.TvStreaming!).ThenInclude(t => t.Operator)
            .Include(o => o.Contracts).ThenInclude(c => c.CancelledByUser)
            .Include(o => o.User)
            .Include(o => o.Store).ThenInclude(s => s.Company)
            .Where(o => o.UpdatedAt.Date >= from.Date && o.UpdatedAt.Date <= to.Date && o.StoreId == storeId && o.Status == OrderStatus.Cancelled)
            .AsNoTracking()
            .ToListAsync();
    }


    /// <summary>
    /// Hämtar kontrakt som makulerats inom ett datumintervall för ett specifikt varuhus
    /// </summary>
    /// <param name="storeId">ID för varuhuset</param>
    /// <param name="from">Startdatum för intervallet</param>
    /// <param name="to">Slutdatum för intervallet</param>
    /// <returns>Lista med makulerade kontrakt</returns>
    public async Task<List<Contract>> GetCancelledContractsByTimeFromDatabase(DateTime from, DateTime to, int storeId)
    {
        return await dbContext.Contracts
            .Include(c => c.Abonnemang!).ThenInclude(a => a.Operator)
            .Include(c => c.Bredband!).ThenInclude(b => b.Operator)
            .Include(c => c.TvStreaming!).ThenInclude(t => t.Operator)
            .Include(c => c.CancelledByUser)
            .Include(c => c.Order).ThenInclude(o => o.User)
            .Include(c => c.Order).ThenInclude(o => o.Store).ThenInclude(s => s.Company)
            .Where(c => c.CancelledAt.HasValue && c.CancelledAt.Value.Date >= from.Date && c.CancelledAt.Value.Date <= to.Date && c.Order.StoreId == storeId)
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Hämtar de senaste skapade/redigerade ordrarna
    /// </summary>
    /// <param name="storeId">ID för varuhuset</param>
    /// <param name="maxItems">Maximalt antal ordrar att hämta</param>
    /// <returns>Lista med ordrar</returns>
    public async Task<List<Order>> GetLatestUpdatedOrdersFromDatabase(int storeId, int maxItems)
    {
        return await dbContext.Orders
            .Where(o => o.StoreId == storeId)
            .OrderByDescending(o => o.UpdatedAt)
            .Take(maxItems)
            .Include(o => o.Contracts).ThenInclude(c => c.Abonnemang!).ThenInclude(a => a.Operator)
            .Include(o => o.Contracts).ThenInclude(c => c.Bredband!).ThenInclude(a => a.Operator)
            .Include(o => o.Contracts).ThenInclude(c => c.TvStreaming!).ThenInclude(a => a.Operator)
            .Include(o => o.Contracts).ThenInclude(c => c.CancelledByUser)
            .Include(o => o.Store).ThenInclude(s => s.Company)
            .Include(o => o.User)
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Hämtar de senaste händelserna
    /// </summary>
    /// <param name="storeId">ID för varuhuset</param>
    /// <returns>Lista med händelser</returns>
    public async Task<List<EventDto>> GetLatestEventsFromDatabase(int storeId)
    {
        IQueryable<EventDto> createdQuery = dbContext.Contracts
            .Where(c => c.Order.StoreId == storeId)
            .AsNoTracking()
            .Select(c => new EventDto
            {
                ContractId = c.Id,
                OrderId = c.OrderId,
                UserId = c.Order.UserId,
                FirstName = c.Order.User.FirstName,
                LastName = c.Order.User.LastName,
                EventType = EventType.Created,
                EventTime = c.CreatedAt,
                ContractType = c.Order.ContractType,
                OperatorName = c.OperatorName,
                IsFokus = c.IsFokus
            });

        IQueryable<EventDto> cancelledQuery = dbContext.Contracts
            .Where(c => c.Order.StoreId == storeId && c.CancelledAt.HasValue && c.Status == ContractStatus.Cancelled)
            .AsNoTracking()
            .Select(c => new EventDto
            {
                ContractId = c.Id,
                OrderId = c.OrderId,
                UserId = c.CancelledByUserId!.Value,
                FirstName = c.CancelledByUser!.FirstName,
                LastName = c.CancelledByUser!.LastName,
                EventType = EventType.Cancelled,
                EventTime = c.CancelledAt!.Value,
                ContractType = c.Order.ContractType,
                OperatorName = c.OperatorName,
                IsFokus = c.IsFokus
            });

        List<EventDto> events = await createdQuery
            .Concat(cancelledQuery)
            .OrderByDescending(e => e.EventTime)
            .Take(70)
            .ToListAsync();

        return events;
    }

    /// <summary>
    /// Hämtar en paginerad lista med ordrar
    /// </summary>
    /// <param name="storeId">ID för varuhuset</param>
    /// <param name="page">Sidnummer</param>
    /// <param name="pageSize">Antal ordrar per sida</param>
    /// <returns>Paginerad lista med ordrar</returns>
    public async Task<List<Order>> GetOrdersPaginatedFromDatabase(int storeId, int page, int pageSize)
    {
        return await dbContext.Orders
            .Where(o => o.StoreId == storeId)
            .OrderByDescending(o => o.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Include(o => o.Contracts).ThenInclude(c => c.Abonnemang!).ThenInclude(a => a.Operator)
            .Include(o => o.Contracts).ThenInclude(c => c.Bredband!).ThenInclude(a => a.Operator)
            .Include(o => o.Contracts).ThenInclude(c => c.TvStreaming!).ThenInclude(a => a.Operator)
            .Include(o => o.Contracts).ThenInclude(c => c.CancelledByUser)
            .Include(o => o.Store).ThenInclude(s => s.Company)
            .Include(o => o.User)
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Hämtar en specifik order för att makulera
    /// </summary>
    /// <param name="id">ID för ordern som ska hämtas</param>
    /// <returns>Ordern eller null om ordern inte finns</returns>
    public async Task<Order?> GetOrderToCancelFromDatabase(int id)
    {
        return await dbContext.Orders.Include(o => o.Contracts).FirstOrDefaultAsync(o => o.Id == id);
    }

    /// <summary>
    /// Sparar ordern till databasen
    /// </summary>
    /// <param name="order">Ordern som ska sparas</param>
    public async Task AddOrderToDatabase(Order order)
    {
        await using var transaction = await dbContext.Database.BeginTransactionAsync();
        try
        {
            dbContext.Orders.Add(order);
            await dbContext.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    /// <summary>
    /// Uppdaterar ordern med nya värden i databasen
    /// </summary>
    /// <param name="order">Ordern som ska uppdateras</param>
    public async Task UpdateOrderInDatabase(Order order)
    {
        await using var transaction = await dbContext.Database.BeginTransactionAsync();
        try
        {
            dbContext.Orders.Update(order);
            await dbContext.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    /// <summary>
    /// Räknar totala antalet ordrar i databasen
    /// </summary>
    /// <param name="storeId">ID för varuhuset</param>
    /// <returns>Antalet ordrar i databasen</returns>
    public async Task<int> GetTotalOrdersFromDatabase(int storeId)
    {
        return await dbContext.Orders.Where(o => o.StoreId == storeId).CountAsync();
    }

    /// <summary>
    /// Hämtar antal abonnemang sålda för respektive operatör inom ett datumintervall
    /// </summary>
    /// <param name="storeId">ID för varuhuset</param>
    /// <param name="from">Startdatum för intervallet</param>
    /// <param name="to">Slutdatum för intervallet</param>
    /// <returns>Dictionary med operator-ID som nyckel och sålda abonnemang som värde</returns>
    public async Task<Dictionary<int, int>> GetAbonnemangSoldPerOperatorFromDatabase(DateTime from, DateTime to, int storeId)
    {
        var createdContracts = await dbContext.Orders
            .Where(o => o.CreatedAt >= from && o.CreatedAt <= to && o.StoreId == storeId && o.ContractType == ContractType.Abonnemang)
            .SelectMany(o => o.Contracts)
            .Where(c => c.IsFokus)
            .GroupBy(c => c.Abonnemang!.OperatorId == (int)Operators.HALEBOP ? (int)Operators.TELIA : c.Abonnemang.OperatorId)
            .Select(g => new { OperatorId = g.Key, Count = g.Count() })
            .ToListAsync();

        var cancelledContracts = await dbContext.Orders
            .Where(o => o.StoreId == storeId && o.ContractType == ContractType.Abonnemang)
            .SelectMany(o => o.Contracts)
            .Where(c => c.Status == ContractStatus.Cancelled && c.CancelledAt >= from && c.CancelledAt <= to && c.IsFokus)
            .GroupBy(c => c.Abonnemang!.OperatorId == (int)Operators.HALEBOP ? (int)Operators.TELIA : c.Abonnemang.OperatorId)
            .Select(g => new { OperatorId = g.Key, Count = g.Count() })
            .ToListAsync();

        Dictionary<int, int> result = createdContracts
            .GroupBy(x => x.OperatorId)
            .ToDictionary(g => g.Key, g => g.Sum(x => x.Count));

        foreach (var canceled in cancelledContracts)
        {
            if (result.ContainsKey(canceled.OperatorId))
            {
                result[canceled.OperatorId] -= canceled.Count;
            }
            else
            {
                result[canceled.OperatorId] = -canceled.Count;
            }
        }

        return result;
    }

    /// <summary>
    /// Hämtar antal abonnemang sålda per dag för ett varuhus inom ett datumintervall
    /// </summary>
    /// <param name="storeId">ID för varuhuset</param>
    /// <param name="from">Startdatum för intervallet</param>
    /// <param name="to">Slutdatum för intervallet</param>
    /// <returns>Dictionary med dag i månaden som nyckel och antal sålda abonnemang som värde</returns>
    public async Task<Dictionary<int, int>> GetAbonnemangSoldPerDayFromDatabase(DateTime from, DateTime to, int storeId)
    {
        var createdContracts = await dbContext.Orders
            .Where(o => o.CreatedAt >= from && o.CreatedAt <= to && o.StoreId == storeId && o.ContractType == ContractType.Abonnemang)
            .SelectMany(o => o.Contracts)
            .Where(c => c.IsFokus)
            .GroupBy(c => c.CreatedAt.Day)
            .Select(g => new { Day = g.Key, Count = g.Count() })
            .ToListAsync();

        var cancelledContracts = await dbContext.Orders
            .Where(o => o.StoreId == storeId && o.ContractType == ContractType.Abonnemang)
            .SelectMany(o => o.Contracts)
            .Where(c => c.Status == ContractStatus.Cancelled && c.CancelledAt >= from && c.CancelledAt <= to && c.IsFokus)
            .GroupBy(c => c.CancelledAt!.Value.Day)
            .Select(g => new { Day = g.Key, Count = g.Count() })
            .ToListAsync();

        Dictionary<int, int> result = createdContracts
            .GroupBy(x => x.Day)
            .ToDictionary(g => g.Key, g => g.Sum(x => x.Count));

        foreach (var canceled in cancelledContracts)
        {
            if (result.ContainsKey(canceled.Day))
            {
                result[canceled.Day] -= canceled.Count;
            }
            else
            {
                result[canceled.Day] = -canceled.Count;
            }
        }

        return result;
    }

    /// <summary>
    /// Hämtar intjänad provision för användaren inom ett datumintervall
    /// </summary>
    /// <param name="from">Startdatum för intervallet</param>
    /// <param name="to">Slutdatum för intervallet</param>
    /// <param name="userId">ID kopplat till användaren</param>
    /// <returns>Intjänad provision för användaren i kronor (KR)</returns>
    public async Task<int> GetProvisionForUserFromDatabase(DateTime from, DateTime to, int userId)
    {
        int provisionFromContracts = await dbContext.Contracts
            .Where(c => c.CreatedAt >= from && c.CreatedAt <= to && c.Order.UserId == userId)
            .AsNoTracking()
            .SumAsync(c => c.Provision);

        int provisionFromCancelledContracts = await dbContext.Contracts
            .Where(c => c.CancelledAt.HasValue && c.CancelledAt.Value >= from && c.CancelledAt.Value <= to && c.Order.UserId == userId)
            .AsNoTracking()
            .SumAsync(c => c.Provision);

        return provisionFromContracts - provisionFromCancelledContracts;
    }
}
