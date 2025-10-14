using api.Dto;
using api.Enums;
using api.Models;
using api.Repositories;

namespace api.Managers;

/// <summary>
/// Hanterar logik för abonnemang
/// </summary>
public class AbonnemangManager(AbonnemangRepository abonnemangRepository)
{
    private readonly AbonnemangRepository abonnemangRepository = abonnemangRepository;

    /// <summary>
    /// Hämtar alla abonnemang
    /// </summary>
    /// <returns>En lista med alla abonnemang</returns>
    /// <exception cref="InvalidOperationException">Kastas om inga abonnemang hittas i databasen.</exception>
    public async Task<List<Abonnemang>> GetAllAbonnemangs()
    {
        List<Abonnemang> abonnemangs = await abonnemangRepository.GetAllAbonnemangsFromDatabase();
        if (!abonnemangs.Any()) throw new InvalidOperationException("Tekniskt fel: Inga abonnemang hittades i systemet. Kontakta support om problemet kvarstår.");
        
        return abonnemangs;
    }

    /// <summary>
    /// Hämtar alla abonnemang baserat på operatör
    /// </summary>
    /// <param name="operatorId">ID på den valda operatören</param>
    /// <returns>En lista med alla abonnemang</returns>
    /// <exception cref="InvalidOperationException">Kastas om inga abonnemang hittas i databasen.</exception>
    /// <exception cref="ArgumentOutOfRangeException">Kastas om operatorId är ogiltig eller negativ.</exception>
    public async Task<List<Abonnemang>> GetAbonnemangsByOperator(int operatorId)
    {
        if (operatorId <= 0) throw new ArgumentOutOfRangeException(nameof(operatorId), "Operatören som angavs vid hämtning av abonnnemang är inte en giltig operatör.");

        List<Abonnemang> abonnemangs = await abonnemangRepository.GetAllAbonnemangsFromDatabaseByOperator(operatorId);
        if (!abonnemangs.Any()) throw new InvalidOperationException("Tekniskt fel: Inga abonnemang hittades i systemet. Kontakta support om problemet kvarstår.");

        return abonnemangs;
    }

    /// <summary>
    /// Hämtar abonnemang som ska synas i lathunden eller mobildeal
    /// </summary>
    /// <returns>En lista med abonnemang som ska synas i lathunden</returns>
    /// <exception cref="InvalidOperationException">Kastas om inga abonnemang hittas i databasen.</exception>
    public async Task<List<Abonnemang>> GetAbonnemangsInLathundOrMobilDeal()
    {
        List<Abonnemang> abonnemangs = await abonnemangRepository.GetAbonnemangsInLathundOrMobilDealFromDatabase();
        if (!abonnemangs.Any()) throw new InvalidOperationException("Tekniskt fel: Inga abonnemang hittades i systemet. Kontakta support om problemet kvarstår.");

        return abonnemangs;
    }

    /// <summary>
    /// Uppdaterar ett valt abonnemang och dess relaterade abonnemang
    /// </summary>
    /// <param name="abonnemangDto">Abonnemanget som ska uppdateras</param>
    /// <returns>En lista med abonnemang som har uppdaterats</returns>
    /// <exception cref="InvalidOperationException">Kastas om abonnemanget inte hittas i databasen.</exception>
    /// <exception cref="ArgumentNullException">Kastas inget abonnemanget skickas med.</exception>
    public async Task<List<Abonnemang>> UpdateAbonnemang(AbonnemangDto abonnemangDto)
    {
        if (abonnemangDto is null) throw new ArgumentNullException(nameof(abonnemangDto), "Inget abonnemang skickades med vid uppdatering.");

        Abonnemang abonnemangToUpdate = await abonnemangRepository.GetAbonnemangByIdFromDatabase(abonnemangDto.Id) ?? throw new InvalidOperationException($"Tekniskt fel: Abonnemanget med ID: {abonnemangDto.Id} kunde inte hittas i systemet. Kontakta support om problemet kvarstår.");
        List<int> abonnemangIdsToUpdate = await GetRelatedAbonnemangIds(abonnemangToUpdate);

        // Hantera Extra Användare
        if (!abonnemangToUpdate.IsHuvudAbonnemang)
        {
            List<int> extraAnvandare = await abonnemangRepository.GetRelatedExtraAnvandareIdsFromDatabase(abonnemangToUpdate);
            abonnemangIdsToUpdate.AddRange(extraAnvandare);
        }

        // Hämta alla abonnemang som ska uppdateras
        List<Abonnemang> abonnemangList = await abonnemangRepository.GetAbonnemangByIdsToUpdateFromDatabase(abonnemangIdsToUpdate);

        // Uppdatera värdena för varje abonnemang
        foreach (Abonnemang abonnemang in abonnemangList)
        {
            abonnemang.ExtraSurf = abonnemangDto.ExtraSurf;
            abonnemang.Discount = abonnemangDto.Discount;
        }

        await abonnemangRepository.UpdateAbonnemangInDatabase(abonnemangList);
        return abonnemangList;
    }

    /// <summary>
    /// Hämtar ID:n för relaterade abonnemang baserat på operatör
    /// </summary>
    /// <param name="abonnemang">Abonnemanget att hämta relaterade ID:n för</param>
    /// <returns>En lista med ID:n för relaterade abonnemang</returns>
    public async Task<List<int>> GetRelatedAbonnemangIds(Abonnemang abonnemang)
    {
        List<int> ids = new List<int> { abonnemang.Id };
        if (!abonnemang.IsHuvudAbonnemang) return ids;

        // Hantera Telenor
        if (abonnemang.OperatorId == (int)Operators.TELENOR)
        {
            Abonnemang? delbetalningsAbonnemang = await abonnemangRepository.GetDelbetalningsAbonnemangFromDatabase(abonnemang);
            if (delbetalningsAbonnemang is not null) ids.Add(delbetalningsAbonnemang.Id);
        }

        // Hantera Telia
        else if (abonnemang.OperatorId == (int)Operators.TELIA)
        {
            // Hitta DELB-varianten
            Abonnemang? delbetalningsAbonnemang = await abonnemangRepository.GetDelbetalningsAbonnemangFromDatabase(abonnemang);
            if (delbetalningsAbonnemang is not null) ids.Add(delbetalningsAbonnemang.Id);

            // Hitta UNGDOM-varianten
            Abonnemang? ungdomsAbonnemang = await abonnemangRepository.GetUngdomsAbonnemangFromDatabase(abonnemang);
            if (ungdomsAbonnemang is not null)
            {
                ids.Add(ungdomsAbonnemang.Id);

                // Hitta UNGDOM DELB-varianten
                Abonnemang? ungdomDelbAbonnemang = await abonnemangRepository.GetUngdomsDelbetalningsAbonnemangFromDatabase(ungdomsAbonnemang);
                if (ungdomDelbAbonnemang is not null) ids.Add(ungdomDelbAbonnemang.Id);
            }
        }

        // Hantera Halebop
        else if (abonnemang.OperatorId == (int)Operators.HALEBOP)
        {
            // Hitta DELB-varianten
            Abonnemang? delbAbonnemang = await abonnemangRepository.GetDelbetalningsAbonnemangFromDatabase(abonnemang);
            if (delbAbonnemang is not null) ids.Add(delbAbonnemang.Id);

            // Hitta UNGDOM-varianten
            Abonnemang? ungdomAbonnemang = await abonnemangRepository.GetStudentAbonnemangFromDatabase(abonnemang);
            if (ungdomAbonnemang is not null)
            {
                ids.Add(ungdomAbonnemang.Id);

                // Hitta UNGDOM DELB-varianten
                Abonnemang? ungdomDelbAbonnemang = await abonnemangRepository.GetUngdomsDelbetalningsAbonnemangFromDatabase(ungdomAbonnemang);
                if (ungdomDelbAbonnemang is not null) ids.Add(ungdomDelbAbonnemang.Id);
            }
        }

        return ids;
    }
}