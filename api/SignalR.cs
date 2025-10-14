using api.Managers;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace api;

/// <summary>
/// SignalR hub för att skicka händelser till frontend
/// </summary>
[Authorize(Policy = "UserPolicy")]
public sealed class SignalR(UserManager userManager, ILogger<SignalR> logger) : Hub
{
    private readonly UserManager userManager = userManager;
    private readonly ILogger<SignalR> logger = logger;

    /// <summary>
    /// När en klient ansluter till hubben, hämtar vi användaren och lägger till klienten i rätt varuhusgrupp
    /// </summary>
    public override async Task OnConnectedAsync()
    {
        try
        {
            User? user = await userManager.GetUser(Context.User!);
            if (user is null)
            {
                string? email = Context.User?.FindFirstValue(ClaimTypes.Upn) ?? Context.User?.FindFirstValue(ClaimTypes.Email);
                logger.LogWarning($"SignalR: Användare med email '{email ?? "okänd"}' kunde inte verifieras vid anslutning: {Context.ConnectionId}");
                Context.Abort();
                return;
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, user.StoreId.ToString());
            logger.LogInformation($"Användare {user.FirstName} {user.LastName} (ID: {user.Id}) från varuhus-ID: {user.StoreId} anslöt sig till SignalR med anslutnings-ID: {Context.ConnectionId}");

            await base.OnConnectedAsync();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"Tekniskt fel uppstod vid SignalR anslutning: {Context.ConnectionId}");
            Context.Abort();
        }
    }

    /// <summary>
    /// När klienten kopplar från, tar vi bort den från varuhusgruppen
    /// </summary>
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        try
        {
            User? user = await userManager.GetUser(Context.User!);
            if (user is not null)
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, user.StoreId.ToString());
                logger.LogInformation($"Användaren från varuhus-ID: {user.StoreId} kopplade från SignalR med anslutnings-ID: {Context.ConnectionId}");
            }

            await base.OnDisconnectedAsync(exception);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"Tekniskt fel uppstod vid SignalR-frånkoppling: {Context.ConnectionId}");
        }
    }
}
