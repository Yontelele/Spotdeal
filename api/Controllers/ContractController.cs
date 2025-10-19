using api.Dto;
using api.Managers;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

/// <summary>
/// API för att hantera kontrakt
/// </summary>
[Route("api/contract")]
public class ContractController(ContractCodesManager contractCodesManager, ILogger<ContractController> logger) : ApiControllerBase
{
    private readonly ContractCodesManager contractCodesManager = contractCodesManager;
    private readonly ILogger<ContractController> logger = logger;

    /// <summary>
    /// Genererar koder baserat på innehållet i varukorgen
    /// </summary>
    /// <param name="cart">Varukorg i frontend innehållande abonnemang, bredband, TV och telefoner</param>
    /// <returns>De genererade koderna kopplade till varukorgen</returns>
    [HttpPost("code")]
    public async Task<IActionResult> GenerateContractCodes([FromBody] CartDto cart)
    {
        try
        {
            List<ContractCodeListDto> contractCodes = await contractCodesManager.GenerateContractCodes(cart);

            logger.LogInformation($"Kontraktkoder hämtades av användare {CurrentUser.FirstName} {CurrentUser.LastName} från varuhus {CurrentUser.Store.Name}");
            return Ok(contractCodes);
        }
        catch (ArgumentNullException ex)
        {
            logger.LogError(ex, "Varukorgen saknade artiklar vid försök att generera kontraktskoder");
            return BadRequest(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            logger.LogError(ex, $"Ogiltig varukorg vid generering av kontraktskoder: {ex.Message}");
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            logger.LogError(ex, $"Obligatoriska kontraktskoder kunde inte hittas: {ex.Message}");
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Tekniskt fel uppstod vid generering av kontraktskoder");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ett oväntat fel uppstod. Vänligen försök igen senare." });
        }
    }
}