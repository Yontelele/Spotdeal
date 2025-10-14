using api.Dto;
using api.Managers;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

/// <summary>
/// API för att hantera mobildeal
/// </summary>
[Route("api/mobildeal")]
public class MobilDealController(MobilDealManager mobilDealManager, ILogger<MobilDealController> logger) : ApiControllerBase
{
    private readonly MobilDealManager mobilDealManager = mobilDealManager;
    private readonly ILogger<MobilDealController> logger = logger;

    /// <summary>
    /// Hämtar de mest fördelaktiga abonnemangen för en vald telefon
    /// </summary>
    /// <param name="phoneId">ID för den valda telefonen</param>
    /// <returns>Lista med de mest fördelaktiga abonnemangen kategoriserade</returns>
    [HttpGet("{phoneId}")]
    public async Task<IActionResult> GetMobilDeal(int phoneId)
    {
		try
		{
            logger.LogInformation($"Hämtar mobildeals för telefon med ID: {phoneId}, användare: {CurrentUser.FirstName} {CurrentUser.LastName} från varuhus {CurrentUser.Store.Name}");

            MobilDealDto mobildeal = await mobilDealManager.GetMobilDeal(phoneId);
            return Ok(mobildeal);
        }
        catch (ArgumentException ex)
        {
            logger.LogError(ex, $"Fel vid försök av hämtning av mobildeals för telefon med ID: {phoneId}");
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            logger.LogError(ex, "Inga abonnemang hittades i databasen vid hämtning av huvudabonnemang");
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"Tekniskt fel uppstod vid hämtning av mobildeal för telefon med ID: {phoneId}");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ett oväntat fel uppstod. Vänligen försök igen senare." });
        }
    }
}
