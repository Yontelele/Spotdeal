using api.Managers;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace api.Authorization;

/// <summary>
/// Hanterar valideringen genom att kontrollera att den inloggade användaren existerar i databasen.
/// </summary>
public class UserHandler(UserManager userManager, ILogger<UserHandler> logger, IHttpContextAccessor httpContextAccessor) : AuthorizationHandler<UserRequirement>
{
    private readonly UserManager userManager = userManager;
    private readonly ILogger<UserHandler> logger = logger;
    private readonly IHttpContextAccessor httpContextAccessor = httpContextAccessor;

    /// <summary>
    /// Validerar om den inloggade användaren finns i databasen baserat på den inloggade användarens token.
    /// </summary>
    /// <param name="context">Kontexten för auktoriseringen</param>
    /// <param name="requirement">Kravet som ska valideras</param>
    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, UserRequirement requirement)
    {
        try
        {
            User? user = await userManager.GetUser(context.User);

            if (user is not null)
            {
                httpContextAccessor.HttpContext!.Items["CurrentUser"] = user;
                context.Succeed(requirement);
            }
            else
            {
                string? email = context.User.FindFirstValue(ClaimTypes.Upn) ?? context.User.FindFirstValue(ClaimTypes.Email);
                logger.LogWarning($"Användare med email '{email ?? "okänd"}' hittades inte i databasen.");
                context.Fail();
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Tekniskt fel uppstod vid validering av användare mot databasen.");
            context.Fail();
        }
    }
}
