namespace api.Dto;

/// <summary>
/// Objekt på de telefoner som valts i varukorgen från frontend
/// </summary>
public class PhoneInCartDto
{
    /// <summary>
    /// Telefon-ID på telefonen som valts
    /// </summary>
    public int PhoneId { get; set; }

    /// <summary>
    /// Abonnemang-ID på det abonnemang som telefonen är kopplad till
    /// </summary>
    public int AbonnemangId { get; set; }

    /// <summary>
    /// Flagga om telefonen är köpt med delbetalning
    /// </summary>
    public bool IsDelbetalning { get; set; }

    /// <summary>
    /// Total kostnad för telefonen efter eventuell rabatt
    /// </summary>
    public int Price { get; set; }
}
