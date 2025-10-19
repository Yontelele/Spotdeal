using api.Repositories;
using api.Models;
using api.Dto;

namespace api.Managers;

/// <summary>
/// Hanterar logik för spotdeals
/// </summary>
public class SpotDealManager(SpotDealRepository spotDealRepository, AbonnemangRepository abonnemangRepository, AbonnemangManager abonnemangManager, PhoneRepository phoneRepository)
{
    private readonly SpotDealRepository spotDealRepository = spotDealRepository;
    private readonly AbonnemangRepository abonnemangRepository = abonnemangRepository;
    private readonly AbonnemangManager abonnemangManager = abonnemangManager;
    private readonly PhoneRepository phoneRepository = phoneRepository;

    /// <summary>
    /// Hämtar alla spotdeals
    /// </summary>
    /// <returns>En lista med alla spotdeals</returns>
    public async Task<List<SpotDeal>> GetAllSpotdeals()
    {
        return await spotDealRepository.GetAllSpotDealsFromDatabase();
    }

    /// <summary>
    /// Skapar ny spotdeal
    /// </summary>
    /// <param name="newSpotDeal">Spotdealen som ska skapas</param>
    /// <returns>En lista med spotdeals som har skapats</returns>
    /// <exception cref="InvalidOperationException">Kastas om abonnemang/telefon inte hittas i databasen.</exception>
    /// <exception cref="ArgumentNullException">Kastas om ingen spotdeal skickas med.</exception>
    public async Task<List<SpotDeal>> CreateSpotdeal(SpotDealDto newSpotDeal)
    {
        if (newSpotDeal is null) throw new ArgumentNullException(nameof(newSpotDeal), "Ingen spotdeal skickades med vid skapandet.");

        Abonnemang? abonnemang = await abonnemangRepository.GetAbonnemangByIdFromDatabase(newSpotDeal.AbonnemangId) ?? throw new InvalidOperationException($"Tekniskt fel: Abonnemanget med ID: {newSpotDeal.AbonnemangId} kunde inte hittas i systemet. Kontakta support om problemet kvarstår.");
        List<int> abonnemangIds = await abonnemangManager.GetRelatedAbonnemangIds(abonnemang);

        List<Phone> phoneListWithAllColors = await phoneRepository.GetAllColorsOnPhoneFromDatabase(newSpotDeal.Phone);
        if (!phoneListWithAllColors.Any()) throw new InvalidOperationException($"Tekniskt fel: Inga telefoner hittades för {newSpotDeal.Phone.Model} {newSpotDeal.Phone.Storage}. Kontakta support om problemet kvarstår.");

        List<SpotDeal> spotDeals = new List<SpotDeal>();

        // Skapa spotdeals för alla kombinationer av abonnemang och telefonfärger
        foreach (int abonnemangId in abonnemangIds)
        {
            foreach (Phone phone in phoneListWithAllColors)
            {
                spotDeals.Add(new SpotDeal
                {
                    AbonnemangId = abonnemangId,
                    PhoneId = phone.Id,
                    DiscountAmount = newSpotDeal.DiscountAmount,
                });
            }
        }

        await spotDealRepository.AddSpotDealsToDatabase(spotDeals);
        return spotDeals;
    }

    /// <summary>
    /// Raderar spotdeal
    /// </summary>
    /// <param name="spotdealToDelete">Spotdealen som ska raderas</param>
    /// <returns></returns>
    /// <exception cref="InvalidOperationException">Kastas om spotdeal/telefon inte hittas i databasen.</exception>
    /// <exception cref="ArgumentNullException">Kastas om ingen spotdeal skickas med.</exception>
    public async Task DeleteSpotdeal(SpotDealDto spotdealToDelete)
    {
        if (spotdealToDelete is null) throw new ArgumentNullException(nameof(spotdealToDelete), "Ingen spotdeal skickades med vid raderandet.");

        Abonnemang? abonnemang = await abonnemangRepository.GetAbonnemangByIdFromDatabase(spotdealToDelete.AbonnemangId) ?? throw new InvalidOperationException($"Tekniskt fel: Abonnemanget med ID: {spotdealToDelete.AbonnemangId} kunde inte hittas i systemet. Kontakta support om problemet kvarstår.");
        List<int> abonnemangIds = await abonnemangManager.GetRelatedAbonnemangIds(abonnemang);

        List<Phone> phoneListWithAllColors = await phoneRepository.GetAllColorsOnPhoneFromDatabase(spotdealToDelete.Phone);
        if (!phoneListWithAllColors.Any()) throw new InvalidOperationException($"Tekniskt fel: Inga telefoner hittades för {spotdealToDelete.Phone.Model} {spotdealToDelete.Phone.Storage}. Kontakta support om problemet kvarstår.");

        // Hitta alla spotdeals som matchar
        var spotDealsToDelete = await spotDealRepository.GetSpotdealsByAbonnemangAndPhoneFromDatabase(abonnemangIds, phoneListWithAllColors);
        if (!spotDealsToDelete.Any()) throw new InvalidOperationException($"Tekniskt fel: Inga spotdeals hittades för {spotdealToDelete.Phone.Model} {spotdealToDelete.Phone.Storage} kombinerat med {spotdealToDelete.Abonnemang.Name}. Kontakta support om problemet kvarstår.");

        await spotDealRepository.DeleteSpotdealsFromDatabase(spotDealsToDelete);
    }
}
