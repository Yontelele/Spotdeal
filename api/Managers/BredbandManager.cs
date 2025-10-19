using api.Models;
using api.Repositories;

namespace api.Managers;

/// <summary>
/// Hanterar logik för bredband
/// </summary>
public class BredbandManager(BredbandRepository bredbandRepository)
{
    private readonly BredbandRepository bredbandRepository = bredbandRepository;

    /// <summary>
    /// Hämtar alla bredband
    /// </summary>
    /// <returns>En lista med alla bredband</returns>
    /// <exception cref="InvalidOperationException">Kastas om inga bredband hittas i databasen.</exception>
    public async Task<List<Bredband>> GetAllBredbands()
    {
        List<Bredband> bredbands = await bredbandRepository.GetAllBredbandsFromDatabase();
        if (!bredbands.Any()) throw new InvalidOperationException("Tekniskt fel: Inga bredband hittades i systemet. Kontakta support om problemet kvarstår.");

        return bredbands;
    }

    /// <summary>
    /// Hämtar alla bredband baserat på operatör
    /// </summary>
    /// <param name="operatorId">ID på den valda operatören</param>
    /// <returns>En lista med alla bredband</returns>
    /// <exception cref="InvalidOperationException">Kastas om inga bredband hittas i databasen.</exception>
    /// <exception cref="ArgumentOutOfRangeException">Kastas om operatorId är ogiltig eller negativ.</exception>
    public async Task<List<Bredband>> GetBredbandsByOperator(int operatorId)
    {
        if (operatorId <= 0) throw new ArgumentOutOfRangeException(nameof(operatorId), "Operatören som angavs vid hämtning av bredband är inte en giltig operatör.");

        List<Bredband> bredbands = await bredbandRepository.GetAllBredbandsFromDatabaseByOperator(operatorId);
        if (!bredbands.Any()) throw new InvalidOperationException("Tekniskt fel: Inga bredband hittades i systemet. Kontakta support om problemet kvarstår.");

        return bredbands;
    }
}
