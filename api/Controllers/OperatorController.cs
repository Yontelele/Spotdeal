using api.Dto;
using api.Managers;
using api.Models;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

/// <summary>
/// API för att hantera operatörer
/// </summary>
[Route("api/operator")]
public class OperatorController(IMapper mapper, OperatorManager operatorManager, ILogger<OperatorController> logger) : ApiControllerBase
{
    private readonly OperatorManager operatorManager = operatorManager;
    private readonly IMapper mapper = mapper;
    private readonly ILogger<OperatorController> logger = logger;

    /// <summary>
    /// Hämtar alla operatörer
    /// </summary>
    /// <returns>Alla operatörer från databasen</returns>
    [HttpGet]
    public async Task<IActionResult> GetAllOperators()
    {
        try
        {
            List<Operator> operators = await operatorManager.GetAllOperators();
            List<OperatorDto> operatorsDto = mapper.Map<List<OperatorDto>>(operators);

            return Ok(operatorsDto);
        }
        catch (InvalidOperationException ex)
        {
            logger.LogError(ex, "Inga operatörer hittades i databasen");
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"Tekniskt fel uppstod vid hämtning av alla operatörer");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ett oväntat fel uppstod. Vänligen försök igen senare." });
        }
    }
}
