using Microsoft.AspNetCore.SignalR;
using api.Models;

namespace api.Managers;

/// <summary>
/// Hanterar logik för SignalR
/// </summary>
public class SignalRManager(IHubContext<SignalR> hubContext)
{
    private readonly IHubContext<SignalR> hubContext = hubContext;

    /// <summary>
    /// Skickar notifikation till varuhuset att en order har skapats
    /// </summary>
    /// <param name="user">Användaren som skapade ordern</param>
    public async Task NotifyStoreOrderBeenCreated(User user)
    {
        await hubContext.Clients.Group(user.StoreId.ToString()).SendAsync("orderCreated", new { userId = user.Id, userName = user.FirstName });
    }

    /// <summary>
    /// Skickar notifikation till varuhuset att en order har makulerats
    /// </summary>
    /// <param name="user">Användaren som skapade ordern</param>
    public async Task NotifyStoreOrderBeenCancelled(User user)
    {
        await hubContext.Clients.Group(user.StoreId.ToString()).SendAsync("orderCancelled", new { userId = user.Id, userName = user.FirstName });
    }
}
