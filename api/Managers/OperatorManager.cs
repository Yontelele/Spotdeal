using api.Enums;
using api.Models;
using api.Repositories;

namespace api.Managers;

/// <summary>
/// Hanterar logik för operatörer
/// </summary>
public class OperatorManager(OperatorRepository operatorRepository)
{
    private readonly OperatorRepository operatorRepository = operatorRepository;

    /// <summary>
    /// Hämtar alla operatörer
    /// </summary>
    /// <returns>En lista med alla operatörer</returns>
    /// <exception cref="InvalidOperationException">Kastas om inga operatörer hittas i databasen.</exception>
    public async Task<List<Operator>> GetAllOperators()
    {
        List<Operator> operators = await operatorRepository.GetAllOperatorsFromDatabase();
        if (!operators.Any()) throw new InvalidOperationException("Tekniskt fel: Inga operatörer hittades i systemet. Kontakta support om problemet kvarstår.");

        return operators;
    }

    /// <summary>
    /// Kollar om operatören är Telia eller Halebop
    /// </summary>
    public bool IsTeliaOrHalebop(int operatorId)
    {
        return operatorId == (int)Operators.TELIA || operatorId == (int)Operators.HALEBOP;
    }
}