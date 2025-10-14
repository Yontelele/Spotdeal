using api.Models;
using api.Repositories;

namespace api.Managers;

/// <summary>
/// Hanterar logik för TV och Streaming paket
/// </summary>
public class TvStreamingManager(TvStreamingRepository tvStreamingRepository)
{
    private readonly TvStreamingRepository tvStreamingRepository = tvStreamingRepository;

    /// <summary>
    /// Hämtar alla TV och Streaming paket
    /// </summary>
    /// <returns>En lista med alla TV och Streaming paket</returns>
    /// <exception cref="InvalidOperationException">Kastas om inga TV och Streaming paket hittas i databasen.</exception>
    public async Task<List<TvStreaming>> GetAllTvStreaming()
    {
        List<TvStreaming> tvStreaming = await tvStreamingRepository.GetAllTvStreamingFromDatabase();
        if (!tvStreaming.Any()) throw new InvalidOperationException("Tekniskt fel: Inga TV och Streaming paket hittades i systemet. Kontakta support om problemet kvarstår.");

        return tvStreaming;
    }

    /// <summary>
    /// Hämtar alla TV och Streaming paket baserat på operatör
    /// </summary>
    /// <param name="operatorId">ID på den valda operatören</param>
    /// <returns>En lista med alla TV och Streaming paket</returns>
    /// <exception cref="InvalidOperationException">Kastas om inga TV och Streaming paket hittas i databasen.</exception>
    /// <exception cref="ArgumentOutOfRangeException">Kastas om operatorId är ogiltig eller negativ.</exception>
    public async Task<List<TvStreaming>> GetTvStreamingByOperator(int operatorId)
    {
        if (operatorId <= 0) throw new ArgumentOutOfRangeException(nameof(operatorId), "Operatören som angavs vid hämtning av TV och Streaming paket är inte en giltig operatör.");

        List<TvStreaming> tvStreaming = await tvStreamingRepository.GetAllTvStreamingFromDatabaseByOperator(operatorId);
        if (!tvStreaming.Any()) throw new InvalidOperationException("Tekniskt fel: Inga TV och Streaming paket hittades i systemet. Kontakta support om problemet kvarstår.");

        return tvStreaming;
    }
}
