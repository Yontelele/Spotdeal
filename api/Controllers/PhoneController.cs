using Microsoft.AspNetCore.Mvc;
using api.Managers;
using api.Models;

namespace api.Controllers;

/// <summary>
/// API för att hantera telefoner
/// </summary>
[Route("api/phone")]
public class PhoneController(PhoneManager phoneManager, ILogger<PhoneController> logger) : ApiControllerBase
{
    private readonly PhoneManager phoneManager = phoneManager;
    private readonly ILogger<PhoneController> logger = logger;

    /// <summary>
    /// Hämtar alla telefoner
    /// </summary>
    /// <returns>Alla telefoner från databasen</returns>
    [HttpGet]
    public async Task<IActionResult> GetAllPhones()
    {
        try
        {
            List<Phone> phones = await phoneManager.GetAllPhones();

            return Ok(phones);
        }
        catch (InvalidOperationException ex)
        {
            logger.LogError(ex, "Inga telefoner hittades i databasen");
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"Tekniskt fel uppstod vid hämtning av alla telefoner");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ett oväntat fel uppstod. Vänligen försök igen senare." });
        }
    }
}
