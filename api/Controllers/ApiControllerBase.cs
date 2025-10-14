using api.Extension;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

/// <summary>
/// Bas‑controller som säkerställer att en giltig användare finns tillgänglig via HttpContext.
/// </summary>
[Authorize(Policy = "UserPolicy")]
[ApiController]
public abstract class ApiControllerBase : ControllerBase
{
    /// <summary>
    /// Hämtar den aktuella användaren från HttpContext. 
    /// Om användaren inte finns kastas ett undantag, vilket säkerställer att ingen metod körs utan autentisering.
    /// </summary>
    protected User CurrentUser => HttpContext.GetCurrentUser() ?? throw new UnauthorizedAccessException("Användaren finns inte i systemet. Kontakta support om du anser att detta är felaktigt.");
}
