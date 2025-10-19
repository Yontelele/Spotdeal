using api.Models;

namespace api.Extension;

/// <summary>
/// Extensionmetod för HttpContext
/// </summary>
public static class HttpContextExtension
{
    /// <summary>
    /// Hämtar den validerade användaren från HttpContext.Items
    /// </summary>
    /// <param name="context">HTTP-kontexten</param>
    /// <returns>Den validerade användaren, eller null om ingen användare finns</returns>
    public static User? GetCurrentUser(this HttpContext context) => context.Items.TryGetValue("CurrentUser", out var user) ? user as User : null;
}
