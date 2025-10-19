using Microsoft.AspNetCore.Mvc;
using api.Managers;
using api.Models;
using api.Dto;
using AutoMapper;
using api.AdminDto;
using System.ComponentModel.DataAnnotations;

namespace api.Controllers;

/// <summary>
/// API för att hantera systemet
/// </summary>
[Route("api/admin")]
public class AdminController(UserManager userManager, AbonnemangManager abonnemangManager, SpotDealManager spotDealManager, ILogger<AdminController> logger, IMapper mapper) : ApiControllerBase
{
    private readonly AbonnemangManager abonnemangManager = abonnemangManager;
    private readonly SpotDealManager spotDealManager = spotDealManager;
    private readonly UserManager userManager = userManager;
    private readonly ILogger<AdminController> logger = logger;
    private readonly IMapper mapper = mapper;

    #region Abonnemang

    /// <summary>
    /// Uppdaterar ett valt abonnemang och dess relaterade abonnemang
    /// </summary>
    /// <param name="abonnemangDto">Abonnemanget som ska uppdateras</param>
    /// <returns>En lista med abonnemang som har uppdaterats</returns>
    [HttpPut("abonnemang")]
    public async Task<IActionResult> UpdateAbonnemang([FromBody] AbonnemangDto abonnemangDto)
    {
        try
        {
            if (!userManager.IsUserAdmin(CurrentUser))
            {
                logger.LogError($"Användare {CurrentUser.FirstName} {CurrentUser.LastName} som inte har behörighet, försökte uppdatera ett abonnemang");
                return StatusCode(StatusCodes.Status403Forbidden, new { message = "Du har inte behörighet att uppdatera abonnemang." });
            }

            List<Abonnemang> abonnemangList = await abonnemangManager.UpdateAbonnemang(abonnemangDto);
            List<AbonnemangDto> abonnemangListDto = mapper.Map<List<AbonnemangDto>>(abonnemangList);

            logger.LogInformation($"Användare {CurrentUser.FirstName} {CurrentUser.LastName} uppdaterade abonnemang {abonnemangDto.Name} med nya värden");
            return Ok(abonnemangListDto);
        }
        catch (ArgumentNullException ex)
        {
            logger.LogError(ex, "Inget abonnemang skickades vid försök att uppdatera abonnemang.");
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            logger.LogError(ex, $"Inget abonnemang hittades i databasen för med ID: {abonnemangDto.Id}");
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"Tekniskt fel uppstod vid uppdatering av abonnemang: {abonnemangDto.Name}");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ett oväntat fel uppstod. Vänligen försök igen senare." });
        }
    }

    #endregion

    #region Spotdeals

    /// <summary>
    /// Skapar ny spotdeal
    /// </summary>
    /// <param name="newSpotDeal">Spotdealen som ska skapas</param>
    /// <returns>En lista med spotdeals som har skapats</returns>
    [HttpPost("spotdeals")]
    public async Task<IActionResult> CreateSpotdeal([FromBody] SpotDealDto newSpotDeal)
    {
        try
        {
            if (!userManager.IsUserAdmin(CurrentUser))
            {
                logger.LogError($"Användare {CurrentUser.FirstName} {CurrentUser.LastName} som inte har behörighet, försökte skapa en spotdeal");
                return StatusCode(StatusCodes.Status403Forbidden, new { message = "Du har inte behörighet att skapa spotdeals." });

            }

            List<SpotDeal> spotDeals = await spotDealManager.CreateSpotdeal(newSpotDeal);
            List<SpotDealDto> spotDealsDto = mapper.Map<List<SpotDealDto>>(spotDeals);

            logger.LogInformation($"Användare {CurrentUser.FirstName} {CurrentUser.LastName} skapade spotdeal med abonnemang {newSpotDeal.Abonnemang.Name} kombinerat med {newSpotDeal.Phone.Model} {newSpotDeal.Phone.Storage} där rabatten är {newSpotDeal.DiscountAmount} SEK");
            return Ok(spotDealsDto);
        }
        catch (ArgumentNullException ex)
        {
            logger.LogError(ex, "Ingen spotdeal skickades med vid skapandet av ny spotdeal.");
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            logger.LogError(ex, ex.Message);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"Tekniskt fel uppstod vid skapade av spotdeal med abonnemang {newSpotDeal.Abonnemang.Name} kombinerat med {newSpotDeal.Phone.Model} {newSpotDeal.Phone.Storage} där rabatten är {newSpotDeal.DiscountAmount} SEK");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ett oväntat fel uppstod. Vänligen försök igen senare." });
        }
    }

    /// <summary>
    /// Raderar spotdeal
    /// </summary>
    /// <param name="spotdealToDelete">Spotdealen som ska raderas</param>
    [HttpDelete("spotdeals")]
    public async Task<IActionResult> DeleteSpotdeal([FromBody] SpotDealDto spotdealToDelete)
    {
        try
        {
            if (!userManager.IsUserAdmin(CurrentUser))
            {
                logger.LogError($"Användare {CurrentUser.FirstName} {CurrentUser.LastName} som inte har behörighet, försökte radera en spotdeal");
                return StatusCode(StatusCodes.Status403Forbidden, new { message = "Du har inte behörighet att radera spotdeals." });

            }

            await spotDealManager.DeleteSpotdeal(spotdealToDelete);

            logger.LogInformation($"Spotdeal med abonnemang {spotdealToDelete.Abonnemang.Name} kombinerat med {spotdealToDelete.Phone.Model} {spotdealToDelete.Phone.Storage} där rabatten var {spotdealToDelete.DiscountAmount} SEK, raderades av användaren {CurrentUser.FirstName} {CurrentUser.LastName}");
            return NoContent();
        }
        catch (ArgumentNullException ex)
        {
            logger.LogError(ex, "Ingen spotdeal skickades med vid raderandet av spotdeal.");
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            logger.LogError(ex, ex.Message);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Tekniskt fel uppstod vid radering av spotdeal");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ett oväntat fel uppstod. Vänligen försök igen senare." });
        }
    }

    #endregion

    #region Users

    /// <summary>
    /// Hämtar alla användare
    /// </summary>
    /// <returns>Alla användare från databasen</returns>
    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        try
        {
            if (!userManager.IsUserAdmin(CurrentUser))
            {
                logger.LogError($"Användare {CurrentUser.FirstName} {CurrentUser.LastName} som inte har behörighet, försökte hämta alla användare från databasen");
                return StatusCode(StatusCodes.Status403Forbidden, new { message = "Du har inte behörighet att hämta användare från databasen." });
            }

            List<User> users = await userManager.GetAllUsers();
            List<AdminUserDto> usersDto = mapper.Map<List<AdminUserDto>>(users);

            return Ok(usersDto);
        }
        catch (InvalidOperationException ex)
        {
            logger.LogError(ex, "Inga användare hittades i databasen");
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Tekniskt fel uppstod vid hämtning av alla användare");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ett oväntat fel uppstod. Vänligen försök igen senare." });
        }
    }

    /// <summary>
    /// Hämtar en användare
    /// </summary>
    /// <param name="id">ID kopplat till användaren</param>
    /// <returns>Användaren</returns>
    [HttpGet("users/{id}")]
    public async Task<IActionResult> GetUser(int id)
    {
        try
        {
            if (!userManager.IsUserAdmin(CurrentUser))
            {
                logger.LogError($"Användare {CurrentUser.FirstName} {CurrentUser.LastName} som inte har behörighet, försökte hämta en användare från databasen");
                return StatusCode(StatusCodes.Status403Forbidden, new { message = "Du har inte behörighet att hämta användare från databasen." });
            }

            User user = await userManager.GetUserById(id);
            AdminUserDto userDto = mapper.Map<AdminUserDto>(user);

            return Ok(userDto);
        }
        catch (KeyNotFoundException ex)
        {
            logger.LogError(ex, $"Användaren med ID: {id} hittades inte i databasen.");
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"Tekniskt fel uppstod vid hämtning av användare med ID: {id}");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ett oväntat fel uppstod. Vänligen försök igen senare." });
        }
    }

    /// <summary>
    /// Skapar en ny användare
    /// </summary>
    /// <param name="newUser">Data för den nya användaren</param>
    /// <returns>Den skapade användaren</returns>
    [HttpPost("users")]
    public async Task<IActionResult> CreateUser([FromBody] NewUserDto newUser)
    {
        try
        {
            if (!userManager.IsUserAdmin(CurrentUser))
            {
                logger.LogError($"Användare {CurrentUser.FirstName} {CurrentUser.LastName} som inte har behörighet, försökte skapa en ny användare");
                return StatusCode(StatusCodes.Status403Forbidden, new { message = "Du har inte behörighet att skapa nya användare." });
            }

            User user = await userManager.CreateUser(newUser);
            AdminUserDto userDto = mapper.Map<AdminUserDto>(user);

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, userDto);
        }
        catch (ArgumentNullException ex)
        {
            logger.LogError(ex, "Obligatoriska fält saknades vid försök att skapa en användare");
            return BadRequest(new { message = ex.Message });
        }
        catch (ValidationException ex)
        {
            logger.LogError(ex, "Valideringsfel vid skapande av användare");
            return BadRequest(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            logger.LogError(ex, "Varuhus kunde inte hittas i systemet vid försök att skapa en användare");
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Tekniskt fel uppstod vid skapande av användare");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ett oväntat fel uppstod. Vänligen försök igen senare." });
        }
    }

    #endregion
}