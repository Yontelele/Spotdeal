namespace api.Dto;

/// <summary>
/// DTO för budget
/// </summary>
public class BudgetDto
{
    /// <summary>
    /// Primärnyckel 
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Varuhus-ID som kopplar budget med varuhus
    /// </summary>
    public int StoreId { get; set; }

    /// <summary>
    /// Operatör-ID som kopplar budget med operatören
    /// </summary>
    public int OperatorId { get; set; }

    /// <summary>
    /// Vilket år som budgeten är kopplad till
    /// </summary>
    public int Year { get; set; }

    /// <summary>
    /// Vilken månad som budgeten är kopplad till
    /// </summary>
    public int Month { get; set; }

    /// <summary>
    /// Antal abonnemang som ska säljas kopplat till den operatören
    /// </summary>
    public int OperatorBudget { get; set; }

    /// <summary>
    /// Varuhuset som är kopplat till budgeten
    /// </summary>
    public StoreDto Store { get; set; } = null!;

    /// <summary>
    /// Operatören som är kopplat till budgeten
    /// </summary>
    public OperatorDto Operator { get; set; } = null!;

    /// <summary>
    /// Antal abonnemang som har sålts kopplat till operatören
    /// </summary>
    public int AbonnemangSold { get; set; }

    /// <summary>
    /// Antal procent (%) abonnemang sålda mot budget
    /// </summary>
    public int Progress { get; set; }

    /// <summary>
    /// Antal abonnemang som varuhuset beräknas sälja kopplat till operatören
    /// </summary>
    public int Trending { get; set; }
}
