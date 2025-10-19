using api.Dto;
using api.Managers;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

/// <summary>
/// API för att hantera användare
/// </summary>
[Route("api/account")]
public class UserController(UserManager userManager, ILogger<UserController> logger) : ApiControllerBase
{
    private readonly UserManager userManager = userManager;
    private readonly ILogger<UserController> logger = logger;

    /// <summary>
    /// Hämtar information om den inloggade användaren.
    /// </summary>
    /// <returns>Information om användaren som en DTO</returns>
    [HttpGet("me")]
    public async Task<IActionResult> GetUser()
    {
        try
        {
            UserDto userDto = await userManager.GetUserDto(CurrentUser);

            logger.LogInformation($"Användaren {CurrentUser.FirstName} {CurrentUser.LastName} från {CurrentUser.Store.Name} loggade in på plattformen.");
            return Ok(userDto);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"Tekniskt fel uppstod vid inloggning av användare");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ett oväntat fel uppstod. Vänligen försök igen senare." });
        }
    }
}
