namespace api.Dto;

/// <summary>
/// Varukorgen som skickas från frontend vid skapande av en ny order. <br/>
/// Består av abonnemang och eventuella telefoner 
/// </summary>
public class CartDto
{
    /// <summary>
    /// Abonnemang som valts i varukorgen från frontend <br/>
    /// Består av en lista med alla IDn på de valda abonnemangen
    /// </summary>
    public List<int> AbonnemangsInCart { get; set; } = new List<int>();

    /// <summary>
    /// Telefoner som valts i varukorgen från frontend <br/>
    /// Består av en lista med de valda telefonerna, abonnemang telefonerna är kopplade till <br/>
    /// samt priset på telefonen kunden ska betala och om telefonen ska delbetalas
    /// </summary>
    public List<PhoneInCartDto> PhonesInCart { get; set; } = new List<PhoneInCartDto>();

    /// <summary>
    /// Bredbandet som valts i varukorgen från frontend <br/>
    /// Består av ID:t på det valda bredbandet
    /// </summary>
    public int? BredbandIdInCart { get; set; }

    /// <summary>
    /// TV och Streaming paketet som valts i varukorgen från frontend <br/>
    /// Består av ID:t på det valda TV och Streaming paketet
    /// </summary>
    public int? TvStreamingIdInCart { get; set; }
}
