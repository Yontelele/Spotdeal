using api.Dto;
using api.Models;
using api.Repositories;
using AutoMapper;

namespace api.Managers;

/// <summary>
/// Hanterar logik för att hitta de bästa mobildealerna
/// </summary>
public class MobilDealManager(AbonnemangRepository abonnemangRepository, SpotDealRepository spotDealRepository, PhoneRepository phoneRepository, IMapper mapper, OperatorManager operatorManager)
{
    private readonly AbonnemangRepository abonnemangRepository = abonnemangRepository;
    private readonly SpotDealRepository spotDealRepository = spotDealRepository;
    private readonly PhoneRepository phoneRepository = phoneRepository;
    private readonly OperatorManager operatorManager = operatorManager;
    private readonly IMapper mapper = mapper;

    /// <summary>
    /// Hämtar de bästa mobildealerna för en vald telefon
    /// </summary>
    /// <param name="phoneId">ID för telefonen som dealerna ska baseras på</param>
    /// <returns>Ett objekt med telefonen och de bästa dealerna</returns>
    /// <exception cref="ArgumentException">Kastas om telefon-ID är ogiltigt eller telefonen inte finns.</exception>
    /// <exception cref="InvalidOperationException">Kastas om inga abonnemang hittas i systemet.</exception>
    public async Task<MobilDealDto> GetMobilDeal(int phoneId)
    {
        // Steg 1: Hämta telefonen från databasen baserat på ID
        Phone phone = await phoneRepository.GetPhoneByIdFromDatabase(phoneId) ?? throw new ArgumentException("Den valda telefonen hittades inte i systemet. Kontakta support om problemet kvarstår.");

        // Steg 2: Hämta alla tillgängliga abonnemang från databasen
        List<Abonnemang> abonnemangs = await abonnemangRepository.GetAllMobilDealAbonnemangFromDatabase();
        if (!abonnemangs.Any()) throw new InvalidOperationException("Tekniskt fel: Inga abonnemang hittades i systemet. Kontakta support om problemet kvarstår.");

        // Steg 3: Hämta eventuella spotdeals för den valda telefonen
        List<SpotDeal> spotDeals = await spotDealRepository.GetSpotdealsByPhoneIdFromDatabase(phoneId);

        // Steg 4: Beräkna alla möjliga deals baserat på telefon, abonnemang och spotdeals
        List<MobilDeal> allDeals = CalculateAllDeals(phone, abonnemangs, spotDeals);

        // Steg 5: Välj ut och kategorisera de bästa dealerna
        List<MobilDeal> bestDeals = CategorizeBestDeals(allDeals);

        // Steg 6: Skapa och returnera resultatet med telefon och deals
        return new MobilDealDto
        {
            Phone = phone,
            Mobildeals = bestDeals,
            TotalAvailableDeals = bestDeals.Count
        };
    }

    /// <summary>
    /// Väljer ut och kategoriserar de bästa dealerna
    /// </summary>
    private List<MobilDeal> CategorizeBestDeals(List<MobilDeal> allDeals)
    {
        List<MobilDeal> bestDeals = new List<MobilDeal>();

        // Steg 1: Hämta de bästa dealerna för olika kategorier
        MobilDeal recommended = FindRecommendedDeal(allDeals);
        MobilDeal maxDiscount = FindMaxDiscountDeal(allDeals);
        MobilDeal cheapest = FindCheapestDeal(allDeals);

        // Steg 2: Lägg till "Vi rekommenderar"-kategorin
        if (recommended is not null)
        {
            recommended.Categories.Add("Vi rekommenderar");
            bestDeals.Add(recommended);
        }

        // Steg 3: Lägg till "Mest rabatt"-kategorin
        if (maxDiscount is not null)
        {
            MobilDeal? existing = bestDeals.FirstOrDefault(d => d.Abonnemang.Id == maxDiscount.Abonnemang.Id);
            if (existing is not null)
            {
                existing.Categories.Add("Mest rabatt på telefonen");
            }
            else
            {
                maxDiscount.Categories.Add("Mest rabatt på telefonen");
                bestDeals.Add(maxDiscount);
            }
        }

        // Steg 4: Lägg till "Billigaste"-kategorin
        if (cheapest is not null)
        {
            MobilDeal? existing = bestDeals.FirstOrDefault(d => d.Abonnemang.Id == cheapest.Abonnemang.Id);
            if (existing is not null)
            {
                existing.Categories.Add("Det billigaste alternativet");
            }
            else
            {
                cheapest.Categories.Add("Det billigaste alternativet");
                bestDeals.Add(cheapest);
            }
        }

        return bestDeals;
    }

    /// <summary>
    /// Beräknar alla möjliga deals och deras kostnader
    /// </summary>
    private List<MobilDeal> CalculateAllDeals(Phone phone, List<Abonnemang> abonnemangs, List<SpotDeal> spotDeals)
    {
        List<MobilDeal> deals = new List<MobilDeal>();

        foreach (Abonnemang abonnemang in abonnemangs)
        {
            // Steg 1: Omvandla abonnemanget till DTO-format
            AbonnemangDto abonnemangDto = mapper.Map<AbonnemangDto>(abonnemang);

            // Steg 2: Kolla om det finns en spotdeal för detta abonnemang och telefon
            SpotDeal? spotDeal = spotDeals.FirstOrDefault(s => s.PhoneId == phone.Id && s.AbonnemangId == abonnemangDto.Id);

            // Steg 3: Bestäm rabatten (spotdeal har företräde framför standardrabatt)
            int phoneDiscount = spotDeal?.DiscountAmount ?? abonnemangDto.Discount;

            // Steg 4: Räkna ut abonnemangets månadspris efter rabatt
            int subscriptionMonthlyCost = abonnemangDto.MonthlyPrice - (abonnemangDto.MonthlyDiscount ?? 0);

            // Steg 5: Räkna ut telefonens månadspris baserat på operatör
            int phoneMonthlyCost = operatorManager.IsTeliaOrHalebop(abonnemangDto.OperatorId)
                ? CalculateTeliaPhoneMonthlyCost(phone, phoneDiscount)
                : CalculateStandardPhoneMonthlyCost(phone, phoneDiscount);

            // Steg 6: Räkna ut totala månadspriset (abonnemang + telefon)
            int totalMonthlyCost = subscriptionMonthlyCost + phoneMonthlyCost;

            // Steg 7: Hantera surfmängd (obegränsad surf blir maxvärdet)
            int surfAmount = abonnemangDto.IsObegransadSurf ? int.MaxValue : (abonnemangDto.Surf ?? 0) + (abonnemangDto.ExtraSurf ?? 0);

            // Steg 8: Beräkna en poäng för att ranka dealen
            double score = CalculateDealScore(totalMonthlyCost, phoneDiscount, surfAmount, abonnemangDto.Provision, spotDeal != null);

            // Steg 9: Skapa en ny deal med all information
            MobilDeal deal = new MobilDeal
            {
                Abonnemang = abonnemangDto,
                Categories = new List<string>(),
                Score = score,
                TotalMonthlyCost = totalMonthlyCost,
                PhoneMontlyCost = phoneMonthlyCost,
                PhoneDiscount = phoneDiscount,
                IsSpotDeal = spotDeal != null
            };

            deals.Add(deal);
        }

        return deals;
    }

    /// <summary>
    /// Hittar dealen med högst poäng (rekommenderad)
    /// </summary>
    private MobilDeal FindRecommendedDeal(List<MobilDeal> deals)
    {
        return deals.OrderByDescending(d => d.Score).FirstOrDefault()!;
    }

    /// <summary>
    /// Hittar dealen med störst rabatt på telefonen
    /// </summary>
    private MobilDeal FindMaxDiscountDeal(List<MobilDeal> deals)
    {
        return deals.OrderByDescending(d => d.PhoneDiscount).FirstOrDefault()!;
    }

    /// <summary>
    /// Hittar dealen med lägst total månadspris
    /// </summary>
    private MobilDeal FindCheapestDeal(List<MobilDeal> deals)
    {
        return deals.OrderBy(d => d.TotalMonthlyCost).FirstOrDefault()!;
    }

    /// <summary>
    /// Räkna ut telefonens månadspris för vanliga operatörer
    /// </summary>
    private int CalculateStandardPhoneMonthlyCost(Phone phone, int discount)
    {
        int priceAfterDiscount = Math.Max(0, phone.Price - discount);
        return (int)Math.Round(priceAfterDiscount / 24.0 / 10) * 10;
    }

    /// <summary>
    /// Räkna ut telefonens månadspris för Telia eller Halebop
    /// </summary>
    private int CalculateTeliaPhoneMonthlyCost(Phone phone, int discount)
    {
        int netPrice = Math.Max(0, phone.Price - discount);

        int lowerHundreds = (netPrice / 100) * 100;
        int upperHundreds = lowerHundreds + 100;

        int lowerPrice = lowerHundreds - 10;
        int upperPrice = upperHundreds - 10;

        int distanceToLower = netPrice - lowerPrice;
        int distanceToUpper = upperPrice - netPrice;

        int chosenTotal;
        if (upperPrice > phone.Price || distanceToLower <= distanceToUpper)
        {
            chosenTotal = lowerPrice;
        }
        else
        {
            chosenTotal = upperPrice;
        }

        return (int)Math.Round(chosenTotal / 24.0);
    }

    /// <summary>
    /// Räkna ut en poäng för att ranka dealen baserat på pris, rabatt, surf, provision och Spotdeal
    /// </summary>
    private double CalculateDealScore(int totalMonthlyCost, int phoneDiscount, int surfAmount, int provision, bool isSpotDeal)
    {
        // Vikter för att balansera olika faktorer
        double weightPrice = 0.20;
        double weightDiscount = 0.25;
        double weightSurf = 0.15;
        double weightProvision = 0.15;
        double weightSpotDeal = 0.25;

        // Normalisera värden till en skala mellan 0 och 1
        double priceScore = Math.Min(1.0, 1.0 / (Math.Log(totalMonthlyCost + 1) + 1)) * weightPrice;
        double discountMultiplier = isSpotDeal ? 1.2 : 1.0;
        double discountScore = Math.Min(1.0, Math.Pow(phoneDiscount / 1000.0, 0.5) * discountMultiplier) * weightDiscount;
        double surfScore = (surfAmount == int.MaxValue ? 1.0 : Math.Log(surfAmount + 1) / Math.Log(1000)) * weightSurf;
        double provisionScore = Math.Min(1.0, Math.Pow(provision / 180.0, 2)) * weightProvision;
        double spotDealScore = isSpotDeal ? weightSpotDeal : 0;

        // Summera den viktade poängen
        return priceScore + discountScore + surfScore + provisionScore + spotDealScore;
    }
}
