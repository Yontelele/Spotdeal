using Microsoft.AspNetCore.Mvc;
using api.Managers;
using api.Dto;
using api.Models;
using AutoMapper;

namespace api.Controllers;

/// <summary>
/// API för att hantera bredband
/// </summary>
[Route("api/bredband")]
public class BredbandController(BredbandManager bredbandManager, ILogger<BredbandController> logger, IMapper mapper) : ApiControllerBase
{
    private readonly BredbandManager bredbandManager = bredbandManager;
    private readonly ILogger<BredbandController> logger = logger;
    private readonly IMapper mapper = mapper;

    /// <summary>
    /// Hämtar alla bredband
    /// </summary>
    /// <returns>Alla bredband från databasen</returns>
    [HttpGet]
    public async Task<IActionResult> GetAllBredbands()
    {
        try
        {
            List<Bredband> bredbandList = await bredbandManager.GetAllBredbands();
            List<BredbandDto> bredbandListDto = mapper.Map<List<BredbandDto>>(bredbandList);

            return Ok(bredbandListDto);
        }
        catch (InvalidOperationException ex)
        {
            logger.LogError(ex, "Inga bredband hittades i databasen");
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Tekniskt fel uppstod vid hämtning av alla bredband");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ett oväntat fel uppstod. Vänligen försök igen senare." });
        }
    }

    /// <summary>
    /// Hämtar alla bredband för den valda operatören
    /// </summary>
    /// <returns>Alla bredband från databasen kopplat till den valda operatören</returns>
    [HttpGet("{operatorId}")]
    public async Task<IActionResult> GetBredbandsByOperator(int operatorId)
    {
        try
        {
            List<Bredband> bredbandList = await bredbandManager.GetBredbandsByOperator(operatorId);
            List<BredbandDto> bredbandListDto = mapper.Map<List<BredbandDto>>(bredbandList);

            return Ok(bredbandListDto);
        }
        catch (ArgumentOutOfRangeException ex)
        {
            logger.LogError(ex, $"En ogiltig operatör angavs vid försök av hämtning av bredband. Den angivna operatören: {operatorId}");
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            logger.LogError(ex, $"Inga bredband hittades i databasen för operatör med ID: {operatorId}");
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"Tekniskt fel uppstod vid hämtning av bredband för operatör med ID: {operatorId}");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ett oväntat fel uppstod. Vänligen försök igen senare." });
        }
    }
}
