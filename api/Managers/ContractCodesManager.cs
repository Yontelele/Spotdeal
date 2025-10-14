using api.Dto;
using api.Models;
using api.Enums;
using api.Repositories;

namespace api.Managers;

/// <summary>
/// Hanterar logik för kontraktkoder
/// </summary>
public class ContractCodesManager(AbonnemangRepository abonnemangRepository, BredbandRepository bredbandRepository, TvStreamingRepository tvStreamingRepository, PhoneRepository phoneRepository, ContractCodesRepository contractCodesRepository)
{
    private readonly AbonnemangRepository abonnemangRepository = abonnemangRepository;
    private readonly BredbandRepository bredbandRepository = bredbandRepository;
    private readonly TvStreamingRepository tvStreamingRepository = tvStreamingRepository;
    private readonly PhoneRepository phoneRepository = phoneRepository;
    private readonly ContractCodesRepository contractCodesRepository = contractCodesRepository;

    /// <summary>
    /// Genererar kontraktskoder baserat på en förfrågan som innehåller abonnemangs-ID:n och eventuella telefon-ID:n.
    /// Hämtar alla koder genom ett flöde. Först koder kopplade till abonnemanget och sedan koder för telefonen.
    /// </summary>
    /// <param name="request">Förfrågan bestående av abonnemangs-ID:n och eventuella telefon-ID:n</param>
    /// <returns>En lista med koder för respektive abonnemang</returns>
    /// <exception cref="ArgumentNullException">Kastas om varukorgen är null eller saknar abonnemang.</exception>
    /// <exception cref="ArgumentException">Kastas om varukorgen innehåller ogiltiga abonnemang eller telefoner.</exception>
    /// <exception cref="InvalidOperationException">Kastas om nödvändiga koder eller data saknas i systemet.</exception>
    public async Task<List<ContractCodeListDto>> GenerateContractCodes(CartDto request)
    {
        if (request is null) throw new ArgumentNullException(nameof(request));

        bool hasNoAbonnemang = !request.AbonnemangsInCart.Any();
        bool hasNoBredband = request.BredbandIdInCart is null;
        bool hasNoTv = request.TvStreamingIdInCart is null;

        if (hasNoAbonnemang && hasNoBredband && hasNoTv) throw new InvalidOperationException("Minst en artikel måste väljas i varukorgen.");

        if (request.BredbandIdInCart is not null)
        {
            Bredband bredband = await bredbandRepository.GetBredbandByIdFromDatabase(request.BredbandIdInCart.Value) ?? throw new ArgumentException("Tekniskt fel: Ett bredband i varukorgen hittades inte i systemet. Kontakta support om problemet kvarstår.");
            List<ContractCodeListDto> contractCodeGroups = new List<ContractCodeListDto>();

            ContractCodeListDto codeGroup = new ContractCodeListDto
            {
                AbonnemangId = bredband.Id,
                Codes = new List<ContractCodeDto>()
            };

            AddContractCode(codeGroup.Codes, bredband.Code, bredband.Name);
            contractCodeGroups.Add(codeGroup);
            return contractCodeGroups;
        }

        else if (request.TvStreamingIdInCart is not null)
        {
            TvStreaming tvStreaming = await tvStreamingRepository.GetTvStreamingByIdFromDatabase(request.TvStreamingIdInCart.Value) ?? throw new ArgumentException("Tekniskt fel: Ett TV och Streaming paket i varukorgen hittades inte i systemet. Kontakta support om problemet kvarstår.");
            List<ContractCodeListDto> contractCodeGroups = new List<ContractCodeListDto>();

            ContractCodeListDto codeGroup = new ContractCodeListDto
            {
                AbonnemangId = tvStreaming.Id,
                Codes = new List<ContractCodeDto>()
            };

            AddContractCode(codeGroup.Codes, tvStreaming.Code, tvStreaming.Name);
            contractCodeGroups.Add(codeGroup);
            return contractCodeGroups;
        }

        else
        {
            // 1. Hämta all data vi behöver från databasen
            ContractCodesFromDatabase dataContext = await FetchAllRequiredDataFromDatabase(request);

            // 2. Skapa en lista för telefonerna i varukorgen
            List<PhoneInCartDto> phonesInCart = request.PhonesInCart.ToList();

            // 3. Skapa en lista för att samla alla kontraktkoder
            List<ContractCodeListDto> contractCodeGroups = new List<ContractCodeListDto>();

            // 4. Gå igenom varje abonnemang i varukorgen
            foreach (int abonnemangId in request.AbonnemangsInCart)
            {
                // 5. Hämta abonnemanget från datakontexten
                if (!dataContext.AbonnemangById.TryGetValue(abonnemangId, out Abonnemang? abonnemang)) throw new ArgumentException("Tekniskt fel: Ett abonnemang i varukorgen hittades inte i systemet. Kontakta support om problemet kvarstår.");

                // 6. Skapa en ny grupp för koder kopplade till detta abonnemang
                ContractCodeListDto codeGroup = new ContractCodeListDto
                {
                    AbonnemangId = abonnemang.Id,
                    Codes = new List<ContractCodeDto>()
                };

                // 7. Lägg till abonnemangets egen kod
                AddContractCode(codeGroup.Codes, abonnemang.Code, abonnemang.Name);

                // 8. Lägg till eventuella subventioner för abonnemanget
                if (dataContext.AbonnemangSubventionsByAbonnemangId.TryGetValue(abonnemangId, out var subventions))
                {
                    foreach (var subvention in subventions)
                    {
                        AddContractCode(codeGroup.Codes, subvention.Code, subvention.Description);
                    }
                }

                // 9. Lägg till inträdesavgift om det är ett nytt huvudabonnemang
                if (abonnemang.IsHuvudAbonnemang && !abonnemang.IsBefintligtAbonnemang && dataContext.IntradesAvgift is not null)
                {
                    AddContractCode(codeGroup.Codes, dataContext.IntradesAvgift.Code, dataContext.IntradesAvgift.Description, dataContext.IntradesAvgift.Value);
                }

                // 10. Kolla om det finns en telefon kopplad till detta abonnemang
                PhoneInCartDto? phoneInCart = phonesInCart.FirstOrDefault(p => p.AbonnemangId == abonnemangId);

                // 11. Om en telefon hittades, hantera den
                if (phoneInCart is not null)
                {
                    // 12. Hämta telefonens detaljer
                    if (!dataContext.PhonesById.TryGetValue(phoneInCart.PhoneId, out Phone? phone)) throw new ArgumentException("Tekniskt fel: En telefon i varukorgen hittades inte i systemet. Kontakta support om problemet kvarstår.");

                    // 13. Lägg till telefonens kod
                    AddContractCode(codeGroup.Codes, phone.Code, $"{phone.Brand} {phone.Model} {phone.Storage} {phone.Color}", phone.Price);

                    // 14. Om telefonen är på delbetalning, hantera delbetalningskoder
                    if (phoneInCart.IsDelbetalning)
                    {
                        // 15. Lägg till delbetalningskod
                        if (!dataContext.DelbetalningskoderByCost.TryGetValue(phoneInCart.Price, out var delbetalningskod)) throw new InvalidOperationException($"Tekniskt fel: Delbetalningskod för {phoneInCart.Price} kr hos den valda operatören hittades inte i systemet. Kontakta support om problemet kvarstår.");
                        AddContractCode(codeGroup.Codes, delbetalningskod.Code, delbetalningskod.Description);


                        // 16. Lägg till förhöjd avgift
                        if (dataContext.ForhojdAvgift is null) throw new InvalidOperationException("Tekniskt fel: Ingen förhöjd-avgift kod hittades hos den valda operatören. Kontakta support om problemet kvarstår.");
                        AddContractCode(codeGroup.Codes, dataContext.ForhojdAvgift.Code, dataContext.ForhojdAvgift.Description, phoneInCart.Price);

                        // 17. Lägg till delbetalningskod för hårdvara om den finns
                        if (dataContext.DelbetalaHardvara is not null)
                        {
                            AddContractCode(codeGroup.Codes, dataContext.DelbetalaHardvara.Code, dataContext.DelbetalaHardvara.Description);
                        }
                    }

                    // 18. Lägg till subventioner för telefon-abonnemang-kombinationen
                    if (dataContext.PhoneBundleSubventionsByAbonnemangAndPhone.TryGetValue((abonnemangId, phoneInCart.PhoneId), out var bundleSubventions))
                    {
                        foreach (var subvention in bundleSubventions)
                        {
                            AddContractCode(codeGroup.Codes, subvention.Code, subvention.Description);
                        }
                    }

                    // 19. Lägg till abonnemangsrabatt
                    if (dataContext.AbonnemangsRabatt is null) throw new InvalidOperationException("Tekniskt fel: Ingen abonnemangs-rabatt kod hittades hos den valda operatören. Kontakta support om problemet kvarstår.");
                    int rabattOnPhone = phone.Price - phoneInCart.Price;

                    if (rabattOnPhone > 0)
                    {
                        AddContractCode(codeGroup.Codes, dataContext.AbonnemangsRabatt.Code, dataContext.AbonnemangsRabatt.Description, rabattOnPhone);
                    }
                    // 20. Ta bort telefonen från listan
                    // - Tar bort telefonen från phonesInCart så den inte används igen för ett annat abonnemang.
                    phonesInCart.Remove(phoneInCart);
                }

                // 21. Lägg till den färdiga kodgruppen i listan
                contractCodeGroups.Add(codeGroup);
            }

            // 22. Returnera listan med alla kodgrupper
            return contractCodeGroups;
        }
    }

    /// <summary>
    /// Skapar en ny ContractCode och lägger till den i listan med resterande kontraktskoder.
    /// </summary>
    /// <param name="codes">Listan med alla resterande kontraktskoder</param>
    /// <param name="code">Den nya koden som ska appliceras i en ny kontraktskod</param>
    /// <param name="description">Beskrivning av koden</param>
    /// <param name="value">Eventuell belopp som är kopplat till koden</param>
    private static void AddContractCode(List<ContractCodeDto> codes, string code, string description, int? value = null)
    {
        codes.Add(new ContractCodeDto
        {
            Code = code,
            Description = description,
            Value = value
        });
    }

    /// <summary>
    /// Hämtar all nödvändig data från databasen på en gång för att minimera antalet databasförfrågningar
    /// </summary>
    /// <param name="request">Förfrågan innehållande abonnemangs-ID:n och telefon-ID:n</param>
    /// <returns>En datakontextmodell innehållande all nödvändig data för kodgenereringen</returns>
    private async Task<ContractCodesFromDatabase> FetchAllRequiredDataFromDatabase(CartDto request)
    {
        // Grundläggande variabler
        List<int> abonnemangIds = request.AbonnemangsInCart.Distinct().ToList();
        List<int> phoneIds = request.PhonesInCart.Select(p => p.PhoneId).Distinct().ToList();

        // Hämta abonnemang
        List<Abonnemang> abonnemangList = await abonnemangRepository.GetAbonnemangByIdsFromDatabase(abonnemangIds);
        Dictionary<int, Abonnemang> abonnemangById = abonnemangList.ToDictionary(a => a.Id);
        int operatorId = abonnemangList.First().OperatorId;

        // Hämta subventioner för enbart abonnemang
        Dictionary<int, List<Subventionskod>> abonnemangSubventionsByAbonnemangId = await contractCodesRepository.GetAbonnemangSubventionsFromDatabase(abonnemangIds);

        // Hämta operatörsspecifika koder
        Dictionary<int, Delbetalningskod> delbetalningskoder = await contractCodesRepository.GetDelbetalningskodFromDatabaseToDictionary(operatorId);
        List<ContractCode> contractCodes = await contractCodesRepository.GetContractCodesFromDatabase(operatorId);
        ContractCode? intradesAvgift = contractCodes.FirstOrDefault(c => c.CodeType == ContractCodeType.IntradesAvgift);
        ContractCode? forhojdAvgift = contractCodes.FirstOrDefault(c => c.CodeType == ContractCodeType.ForhojdAvgift);
        ContractCode? delbetalaHardvara = contractCodes.FirstOrDefault(c => c.CodeType == ContractCodeType.DelbetalaHardvara);
        ContractCode? abonnemangsRabatt = contractCodes.FirstOrDefault(c => c.CodeType == ContractCodeType.AbonnemangsRabatt);

        // Hämta telefoner
        Dictionary<int, Phone> phones = await phoneRepository.GetPhonesByIdsFromDatabaseToDictionary(phoneIds);

        // Hämta subventioner för abonnemang kombinerat med telefon
        Dictionary<(int, int), List<Subventionskod>> phoneBundleSubventionsByAbonnemangAndPhone = await contractCodesRepository.GetPhoneBundleSubventionsFromDatabase(abonnemangIds, phoneIds);

        return new ContractCodesFromDatabase
        {
            AbonnemangById = abonnemangById,
            AbonnemangSubventionsByAbonnemangId = abonnemangSubventionsByAbonnemangId,
            IntradesAvgift = intradesAvgift,
            PhonesById = phones,
            DelbetalningskoderByCost = delbetalningskoder,
            ForhojdAvgift = forhojdAvgift,
            DelbetalaHardvara = delbetalaHardvara,
            PhoneBundleSubventionsByAbonnemangAndPhone = phoneBundleSubventionsByAbonnemangAndPhone,
            AbonnemangsRabatt = abonnemangsRabatt
        };
    }
}

/// <summary>
/// Data som innehåller alla nödvändiga databastabeller för att generera kontraktskoder
/// </summary>
class ContractCodesFromDatabase
{
    public Dictionary<int, Abonnemang> AbonnemangById { get; set; } = new();
    public Dictionary<int, List<Subventionskod>> AbonnemangSubventionsByAbonnemangId { get; set; } = new();
    public Dictionary<int, Phone> PhonesById { get; set; } = new();
    public Dictionary<(int, int), List<Subventionskod>> PhoneBundleSubventionsByAbonnemangAndPhone { get; set; } = new();
    public Dictionary<int, Delbetalningskod> DelbetalningskoderByCost { get; set; } = new();
    public ContractCode? IntradesAvgift { get; set; }
    public ContractCode? DelbetalaHardvara { get; set; }
    public ContractCode? ForhojdAvgift { get; set; }
    public ContractCode? AbonnemangsRabatt { get; set; }
}
