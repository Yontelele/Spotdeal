using Microsoft.AspNetCore.Mvc;
using api.Managers;
using AutoMapper;
using api.Models;
using api.Dto;

namespace api.Controllers;

/// <summary>
/// API för att hantera spotdeals
/// </summary>
[Route("api/spotdeal")]
public class SpotDealController(SpotDealManager spotDealManager, ILogger<SpotDealController> logger, IMapper mapper) : ApiControllerBase
{
    private readonly SpotDealManager spotDealManager = spotDealManager;
    private readonly ILogger<SpotDealController> logger = logger;
    private readonly IMapper mapper = mapper;

    /// <summary>
    /// Hämtar alla spotdeals
    /// </summary>
    /// <returns>Alla spotdeals från databasen</returns>
    [HttpGet]
    public async Task<IActionResult> GetAllSpotdeals()
    {
        try
        {
            List<SpotDeal> spotdeals = await spotDealManager.GetAllSpotdeals();
            List<SpotDealDto> spotDealDtos = mapper.Map<List<SpotDealDto>>(spotdeals);

            return Ok(spotDealDtos);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"Tekniskt fel uppstod vid hämtning av alla spotdeals");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ett oväntat fel uppstod. Vänligen försök igen senare." });
        }
    }
}
