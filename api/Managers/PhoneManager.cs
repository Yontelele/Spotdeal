using api.Models;
using api.Repositories;

namespace api.Managers;

/// <summary>
/// Hanterar logik för telefoner
/// </summary>
public class PhoneManager(PhoneRepository phoneRepository)
{
    private readonly PhoneRepository phoneRepository = phoneRepository;

    /// <summary>
    /// Hämtar alla telefoner
    /// </summary>
    /// <returns>En lista med alla telefoner</returns>
    /// <exception cref="InvalidOperationException">Kastas om inga telefoner hittas i databasen.</exception>
    public async Task<List<Phone>> GetAllPhones()
    {
        List<Phone> phones = await phoneRepository.GetAllPhonesFromDatabase();
        if (!phones.Any()) throw new InvalidOperationException("Tekniskt fel: Inga telefoner hittades i systemet. Kontakta support om problemet kvarstår.");

        return phones;
    }
}
