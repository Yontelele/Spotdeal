using api.Dto;
using api.Managers;
using api.Models;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

/// <summary>
/// API för att hantera ordrar
/// </summary>
[Route("api/order")]
public class OrderController(OrderManager orderManager, ILogger<OrderController> logger, IMapper mapper, SignalRManager signalRManager) : ApiControllerBase
{
    private readonly OrderManager orderManager = orderManager;
    private readonly SignalRManager signalRManager = signalRManager;
    private readonly ILogger<OrderController> logger = logger;
    private readonly IMapper mapper = mapper;

    /// <summary>
    /// Skapar en ny order
    /// </summary>
    /// <param name="cart">Varukorg i frontend innehållande abonnemang, bredband, TV och telefoner</param>
    /// <returns>Den registrerade ordern</returns>
    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CartDto cart)
    {
        try
        {
            Order order = await orderManager.CreateOrder(cart, CurrentUser);
            OrderDto orderDto = mapper.Map<OrderDto>(order);

            logger.LogInformation($"Användaren {CurrentUser.FirstName} {CurrentUser.LastName} från varuhus: {CurrentUser.Store.Name} skapade en order med ID: {order.Id}");

            await signalRManager.NotifyStoreOrderBeenCreated(CurrentUser);
            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, orderDto);
        }
        catch (ArgumentNullException ex)
        {
            logger.LogError(ex, "Varukorgen saknade artiklar vid försök att skapa en order");
            return BadRequest(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            logger.LogError(ex, "Ogiltig varukorg vid skapande av order");
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            logger.LogError(ex, $"Obligatoriska artiklar kunde inte hittas vid försök att skapa order: {ex.Message}");
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Tekniskt fel uppstod vid skapande av order");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ett oväntat fel uppstod. Vänligen försök igen senare." });
        }
    }

    /// <summary>
    /// Makulerar kontrakt kopplat till ordern
    /// </summary>
    /// <param name="id">ID kopplat till ordern som ska makuleras</param>
    /// <param name="cancelOrderRequest">De kontrakt som ska makuleras kombinerat med en anledning</param>
    /// <returns>Status för makuleringen</returns>
    [HttpPut("{id}/cancel")]
    public async Task<ActionResult> CancelOrder(int id, [FromBody] CancelOrderDto cancelOrderRequest)
    {
        try
        {
            bool result = await orderManager.CancelOrder(id, CurrentUser, cancelOrderRequest.ContractIds, cancelOrderRequest.Reason);

            logger.LogInformation($"Order med ID: {id} makulerades av användaren {CurrentUser.FirstName} {CurrentUser.LastName} från varuhus {CurrentUser.Store.Name} med anledning: {cancelOrderRequest.Reason}");

            await signalRManager.NotifyStoreOrderBeenCancelled(CurrentUser);
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            logger.LogWarning(ex, $"Ogiltigt anrop för makulering av order: {id}");
            return BadRequest(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            logger.LogError(ex, $"Order {id} hittades inte vid försöker till makulering");
            return NotFound(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            logger.LogError(ex, $"Användaren saknar behörighet att makulera order: {id}");
            return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            logger.LogInformation(ex, $"Försök till att makulera order: {id} som redan är makulerad");
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Tekniskt fel uppstod vid makulering av ordern");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ett oväntat fel uppstod. Vänligen försök igen senare." });
        }
    }

    /// <summary>
    /// Hämtar en order
    /// </summary>
    /// <param name="id">ID för ordern</param>
    /// <returns>Ordern</returns>
    [HttpGet("{id}")]
    public async Task<ActionResult> GetOrder(int id)
    {
        try
        {
            Order? order = await orderManager.GetOrderById(id);
            OrderDto orderDto = mapper.Map<OrderDto>(order);

            logger.LogInformation($"Order med ID: {orderDto.Id} hämtades av användare {CurrentUser.FirstName} {CurrentUser.LastName} från {CurrentUser.Store.Name}");
            return Ok(orderDto);
        }
        catch (KeyNotFoundException ex)
        {
            logger.LogWarning($"Order hittades inte med ID: {id} vid hämtning av order");
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"Tekniskt fel uppstod vid hämtning av order med ID: {id}");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ett oväntat fel uppstod. Vänligen försök igen senare." });
        }
    }

    /// <summary>
    /// Hämtar en paginerad lista med ordrar för orderhistorik
    /// </summary>
    /// <param name="page">Sidnummer</param>
    /// <returns>En paginerad lista med ordrar</returns>
    [HttpGet]
    public async Task<IActionResult> GetOrders(int page = 1)
    {
        try
        {
            OrderPageDto orders = await orderManager.GetOrdersPaginated(CurrentUser.StoreId, page);

            logger.LogInformation($"Hämtade {orders.Orders.Count} ordrar av totalt {orders.TotalCount} för varuhus {CurrentUser.Store.Name}");
            return Ok(orders);
        }
        catch (ArgumentOutOfRangeException ex)
        {
            logger.LogError(ex, $"En ogiltigt sidnummer angavs vid försök av hämtning av ordrar, användar-ID: {CurrentUser.Id}. Det angivna sidnumret: {page}");
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, $"Tekniskt fel uppstod vid hämtning av ordrar");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ett oväntat fel uppstod. Vänligen försök igen senare." });
        }
    }
}
