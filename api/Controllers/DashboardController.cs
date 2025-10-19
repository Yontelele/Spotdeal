using api.Dto;
using api.Managers;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

/// <summary>
/// API för att hantera dashboard
/// </summary>
[Route("api/dashboard")]
public class DashboardController(ILogger<DashboardController> logger, DashboardManager dashboardManager) : ApiControllerBase
{
    private readonly ILogger<DashboardController> logger = logger;
    private readonly DashboardManager dashboardManager = dashboardManager;

    /// <summary>
    /// Hämtar all dashboard-data för nuvarande månad
    /// </summary>
    /// <returns>Dashboard data</returns>
    [HttpGet]
    public async Task<IActionResult> GetDashboardData()
    {
        try
        {
            DashboardDto dashboardDto = await dashboardManager.GetDashboardData(CurrentUser.StoreId);

            return Ok(dashboardDto);
        }
        catch (InvalidOperationException ex)
        {
            logger.LogError(ex, $"Ingen budget hittades i databasen vid försök av hämtning av budget.");
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Tekniskt fel uppstod vid hämtning av dashboard-data");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ett oväntat fel uppstod. Vänligen försök igen senare." });
        }
    }
}
