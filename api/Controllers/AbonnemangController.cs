using Microsoft.AspNetCore.Mvc;
using api.Managers;
using api.Dto;
using api.Models;
using AutoMapper;

namespace api.Controllers;

/// <summary>
/// API för att hantera abonnemang
/// </summary>
[Route("api/abonnemang")]
public class AbonnemangController(AbonnemangManager abonnemangManager, ILogger<AbonnemangController> logger, IMapper mapper) : ApiControllerBase
{
    private readonly AbonnemangManager abonnemangManager = abonnemangManager;
    private readonly ILogger<AbonnemangController> logger = logger;
    private readonly IMapper mapper = mapper;

    /// <summary>
    /// Hämtar alla abonnemang
    /// </summary>
    /// <returns>Alla abonnemang från databasen</returns>
    [HttpGet]
    public async Task<IActionResult> GetAllAbonnemangs()
    {
        try
        {
            List<Abonnemang> abonnemangList = await abonnemangManager.GetAllAbonnemangs();
            List<AbonnemangDto> abonnemangListDto = mapper.Map<List<AbonnemangDto>>(abonnemangList);

            return Ok(abonnemangListDto);
        }
        catch (InvalidOperationException ex)
        {
            logger.LogError(ex, "Inga abonnemang hittades i databasen");
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Tekniskt fel uppstod vid hämtning av alla abonnemang");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ett oväntat fel uppstod. Vänligen försök igen senare." });
        }
    }

    /// <summary>
    /// Hämtar alla abonnemang för den valda operatören
    /// </summary>
    /// <returns>Alla abonnemang från databasen kopplat till den valda operatören</returns>
    [HttpGet("{operatorId}")]
    public async Task<IActionResult> GetAbonnemangsByOperator(int operatorId)
    {
        try
        {
            List<Abonnemang> abonnemangList = await abonnemangManager.GetAbonnemangsByOperator(operatorId);
            List<AbonnemangDto> abonnemangListDto = mapper.Map<List<AbonnemangDto>>(abonnemangList);

            return Ok(abonnemangListDto);
        }
        catch (ArgumentOutOfRangeException ex)
        {
            logger.LogError(ex, $"En ogiltig operatör angavs vid försök av hämtning av abonnemang. Den angivna operatören: {operatorId}");
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            logger.LogError(ex, $"Inga abonnemang hittades i databasen för operatör med ID: {operatorId}");
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"Tekniskt fel uppstod vid hämtning av abonnemang för operatör med ID: {operatorId}");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ett oväntat fel uppstod. Vänligen försök igen senare." });
        }
    }

    /// <summary>
    /// Hämtar abonnemang som ska synas i lathunden eller mobildeal
    /// </summary>
    /// <returns>Abonnemangen som ska synas i lathunden eller mobildeal</returns>
    [HttpGet("lathund-mobildeal")]
    public async Task<IActionResult> GetAbonnemangsInLathundOrMobilDeal()
    {
        try
        {
            List<Abonnemang> abonnemangList = await abonnemangManager.GetAbonnemangsInLathundOrMobilDeal();
            List<AbonnemangDto> abonnemangListDto = mapper.Map<List<AbonnemangDto>>(abonnemangList);

            return Ok(abonnemangListDto);
        }
        catch (InvalidOperationException ex)
        {
            logger.LogError(ex, "Inga abonnemang hittades i databasen");
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Tekniskt fel uppstod vid hämtning av alla abonnemang");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ett oväntat fel uppstod. Vänligen försök igen senare." });
        }
    }
}