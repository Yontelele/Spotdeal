using api.Dto;
using api.Models;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using api.Managers;

namespace api.Controllers;

/// <summary>
/// API för att hantera budget
/// </summary>
[Route("api/budget")]
public class BudgetController(ILogger<BudgetController> logger, IMapper mapper, UserManager userManager, BudgetManager budgetManager) : ApiControllerBase
{
    private readonly UserManager userManager = userManager;
    private readonly BudgetManager budgetManager = budgetManager;
    private readonly IMapper mapper = mapper;
    private readonly ILogger<BudgetController> logger = logger;

    /// <summary>
    /// Hämtar budget för ett specifikt varuhus
    /// </summary>
    /// <returns>Lista med alla operatörsbudgetar för varuhuset</returns>
    [HttpGet]
    public async Task<IActionResult> GetBudget()
    {
        try
        {
            List<BudgetDto> budgetDto = await budgetManager.GetBudget(CurrentUser.StoreId);

            return Ok(budgetDto);
        }
        catch (InvalidOperationException ex)
        {
            logger.LogError(ex, $"Ingen budget hittades i databasen vid försök av hämtning av budget.");
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Tekniskt fel uppstod vid hämtning av budget");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ett oväntat fel uppstod. Vänligen försök igen senare." });
        }
    }

    /// <summary>
    /// Uppdaterar budget för ett varuhus och operatör för en specifik månad/år
    /// </summary>
    /// <param name="budgetToUpdate">Budgetdata att uppdatera</param>
    /// <returns>Den uppdaterade budgeten</returns>
    [HttpPost]
    public async Task<IActionResult> UpdateBudget([FromBody] BudgetDto budgetToUpdate)
    {
        try
        {
            if (!userManager.IsUserManagerOrAdmin(CurrentUser))
            {
                logger.LogError($"Användare {CurrentUser.FirstName} {CurrentUser.LastName} som inte har behörighet, försökte uppdatera en budget");
                return StatusCode(StatusCodes.Status403Forbidden, new { message = "Du har inte behörighet att uppdatera budgeten." });
            }

            Budget budget = await budgetManager.UpdateBudget(budgetToUpdate);
            BudgetDto budgetDto = mapper.Map<BudgetDto>(budget);

            logger.LogInformation($"Användare {CurrentUser.FirstName} {CurrentUser.LastName} uppdaterade budget för operatör {budgetDto.OperatorId} i varuhus {CurrentUser.StoreId} för {budgetDto.Year}/{budgetDto.Month} till {budgetDto.OperatorBudget}");
            return Ok(budgetDto);
        }
        catch (ArgumentNullException ex)
        {
            logger.LogError(ex, "Ingen budget skickades vid försök att uppdatera budget.");
            return BadRequest(new { message = ex.Message });
        }
        catch (ArgumentOutOfRangeException ex)
        {
            logger.LogError(ex, $"En ogiltig månad angavs vid försök av uppdatering av budget. Den angivna månaden: {budgetToUpdate.Month}");
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            logger.LogError(ex, $"Försök att uppdatera en budget som inte hittades för operatör {budgetToUpdate?.OperatorId}, varuhus {budgetToUpdate?.StoreId}, år {budgetToUpdate?.Year}, månad {budgetToUpdate?.Month}");
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"Tekniskt fel uppstod vid uppdatering av budget för operatör {budgetToUpdate.OperatorId} i varuhus {budgetToUpdate.StoreId}, år {budgetToUpdate.Year}, månad {budgetToUpdate.Month}");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ett oväntat fel uppstod. Vänligen försök igen senare." });
        }
    }
}
