using Microsoft.AspNetCore.Mvc;
using api.Managers;
using api.Dto;
using api.Models;
using AutoMapper;

namespace api.Controllers;

/// <summary>
/// API för att hantera TV och Streaming paket
/// </summary>
[Route("api/tv")]
public class TvStreamingController(TvStreamingManager tvStreamingManager, ILogger<TvStreamingController> logger, IMapper mapper) : ApiControllerBase
{
    private readonly TvStreamingManager tvStreamingManager = tvStreamingManager;
    private readonly ILogger<TvStreamingController> logger = logger;
    private readonly IMapper mapper = mapper;

    /// <summary>
    /// Hämtar alla TV och Streaming paket
    /// </summary>
    /// <returns>Alla TV och Streaming paket från databasen</returns>
    [HttpGet]
    public async Task<IActionResult> GetAllTvStreaming()
    {
        try
        {
            List<TvStreaming> tvStreamingList = await tvStreamingManager.GetAllTvStreaming();
            List<TvStreamingDto> tvStreamingListDto = mapper.Map<List<TvStreamingDto>>(tvStreamingList);

            return Ok(tvStreamingListDto);
        }
        catch (InvalidOperationException ex)
        {
            logger.LogError(ex, "Inga TV och Streaming paket hittades i databasen");
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Tekniskt fel uppstod vid hämtning av alla TV och Streaming paket");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ett oväntat fel uppstod. Vänligen försök igen senare." });
        }
    }

    /// <summary>
    /// Hämtar alla TV och Streaming paket för den valda operatören
    /// </summary>
    /// <returns>Alla TV och Streaming paket från databasen kopplat till den valda operatören</returns>
    [HttpGet("{operatorId}")]
    public async Task<IActionResult> GetTvStreamingByOperator(int operatorId)
    {
        try
        {
            List<TvStreaming> tvStreamingList = await tvStreamingManager.GetTvStreamingByOperator(operatorId);
            List<TvStreamingDto> tvStreamingListDto = mapper.Map<List<TvStreamingDto>>(tvStreamingList);

            return Ok(tvStreamingListDto);
        }
        catch (ArgumentOutOfRangeException ex)
        {
            logger.LogError(ex, $"En ogiltig operatör angavs vid försök av hämtning av TV och Streaming paket. Den angivna operatören: {operatorId}");
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            logger.LogError(ex, $"Inga TV och Streaming paket hittades i databasen för operatör med ID: {operatorId}");
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"Tekniskt fel uppstod vid hämtning av TV och Streaming paket för operatör med ID: {operatorId}");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ett oväntat fel uppstod. Vänligen försök igen senare." });
        }
    }
}
