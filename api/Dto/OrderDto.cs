using api.Enums;

namespace api.Dto;

/// <summary>
/// DTO för order
/// </summary>
public class OrderDto
{
    /// <summary>
    /// Primärnyckel 
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Tidsstämpel på när ordern blev skapad
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Tidsstämpel på när ordern blev makulerad
    /// </summary>
    public DateTime UpdatedAt { get; set; }

    /// <summary>
    /// Användar-ID som kopplar ordern till säljaren
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// Varuhus-ID som kopplar ordern till varuhuset
    /// </summary>
    public int StoreId { get; set; }

    /// <summary>
    /// Status på ordern (Bekräftad, Makulerad)
    /// </summary>
    public OrderStatus Status { get; set; } = OrderStatus.Confirmed;

    /// <summary>
    /// Vilken typ av kontrakt (Abonnemang, Bredband, TV)
    /// </summary>
    public ContractType ContractType { get; set; } = ContractType.Abonnemang;

    /// <summary>
    /// Användaren som registrerade ordern
    /// </summary>
    public UserDto User { get; set; } = null!;

    /// <summary>
    /// Varuhuset där ordern registrerades
    /// </summary>
    public StoreDto Store { get; set; } = null!;

    /// <summary>
    /// En lista med kontrakt som innehåller alla artiklar som säljaren har registrerat <br/>
    /// Abonnemang, koder och telefoner
    /// </summary>
    public List<ContractDto> Contracts { get; set; } = new List<ContractDto>();
}
