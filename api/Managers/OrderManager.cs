using api.Dto;
using api.Enums;
using api.Helpers;
using api.Models;
using api.Repositories;
using AutoMapper;
using System.Text.Json;

namespace api.Managers;

/// <summary>
/// Hanterar logik för ordrar
/// </summary>
public class OrderManager(PhoneRepository phoneRepository, ContractCodesManager contractCodesManager, OrderRepository orderRepository, AbonnemangRepository abonnemangRepository, BredbandRepository bredbandRepository, TvStreamingRepository tvStreamingRepository, IMapper mapper)
{
    private readonly OrderRepository orderRepository = orderRepository;
    private readonly PhoneRepository phoneRepository = phoneRepository;
    private readonly ContractCodesManager contractCodesManager = contractCodesManager;
    private readonly AbonnemangRepository abonnemangRepository = abonnemangRepository;
    private readonly BredbandRepository bredbandRepository = bredbandRepository;
    private readonly TvStreamingRepository tvStreamingRepository = tvStreamingRepository;
    private readonly IMapper mapper = mapper;

    /// <summary>
    /// Skapar en ny order baserad på kundens valda abonnemang och telefoner i varukorgen
    /// </summary>
    /// <param name="request">Innehållet i varukorgen med abonnemang och telefoner</param>
    /// <param name="user">Användaren som skapar ordern</param>
    /// <returns>Den skapade ordern</returns>
    /// <exception cref="ArgumentException">Kastas om ett eller flera valda abonnemang eller telefoner inte finns</exception>
    /// <exception cref="ArgumentNullException">Kastas om varukorgen är null eller saknar abonnemang.</exception>
    public async Task<Order> CreateOrder(CartDto request, User user)
    {
        if (request is null) throw new ArgumentNullException(nameof(request));

        bool hasNoAbonnemang = !request.AbonnemangsInCart.Any();
        bool hasNoBredband = request.BredbandIdInCart is null;
        bool hasNoTv = request.TvStreamingIdInCart is null;

        if (hasNoAbonnemang && hasNoBredband && hasNoTv) throw new InvalidOperationException("Minst en artikel måste väljas i varukorgen.");
        
        List<ContractCodeListDto> contractsCodes = await contractCodesManager.GenerateContractCodes(request);

        if (request.BredbandIdInCart is not null)
        {
            Bredband bredband = await bredbandRepository.GetBredbandByIdFromDatabase(request.BredbandIdInCart.Value) ?? throw new ArgumentException("Tekniskt fel: Ett bredband i varukorgen hittades inte i systemet. Kontakta support om problemet kvarstår.");
            Order order = CreateNewOrder(user, ContractType.Bredband);

            order.Contracts.Add(CreateContractFromBredband(bredband, contractsCodes[0]));
            await orderRepository.AddOrderToDatabase(order);
            return order;
        }

        else if (request.TvStreamingIdInCart is not null)
        {
            TvStreaming tvStreaming = await tvStreamingRepository.GetTvStreamingByIdFromDatabase(request.TvStreamingIdInCart.Value) ?? throw new ArgumentException("Tekniskt fel: Ett TV och Streaming paket i varukorgen hittades inte i systemet. Kontakta support om problemet kvarstår.");
            Order order = CreateNewOrder(user, ContractType.TV);

            order.Contracts.Add(CreateContractFromTvStreaming(tvStreaming, contractsCodes[0]));
            await orderRepository.AddOrderToDatabase(order);
            return order;
        }

        else
        {
            Dictionary<int, Abonnemang> selectedAbonnemangs = await GetAndValidateAbonnemang(request.AbonnemangsInCart);
            Dictionary<int, Phone> selectedPhones = await GetAndValidatePhones(request.PhonesInCart);

            Order order = CreateNewOrder(user, ContractType.Abonnemang);

            List<PhoneInCartDto> phonesInCart = request.PhonesInCart.ToList();
            for (int i = 0; i < request.AbonnemangsInCart.Count; i++)
            {
                int abonnemangId = request.AbonnemangsInCart[i];
                Abonnemang abonnemang = selectedAbonnemangs[abonnemangId];

                Contract contract = CreateContractFromAbonnemang(abonnemang, contractsCodes[i]);

                PhoneInCartDto? phoneInCart = phonesInCart.FirstOrDefault(p => p.AbonnemangId == abonnemangId);
                if (phoneInCart is not null)
                {
                    AddPhoneToContract(contract, phoneInCart, selectedPhones);
                    phonesInCart.Remove(phoneInCart);
                }

                order.Contracts.Add(contract);
            }

            await orderRepository.AddOrderToDatabase(order);
            return order;
        }
    }

    /// <summary>
    /// Hämtar och validerar abonnemang baserat på en lista med abonnemang-ID:n.
    /// </summary>
    /// <param name="abonnemangIds">Lista med abonnemang-ID:n från varukorgen</param>
    /// <returns>En dictionary med abonnemang-ID som nyckel och abonnemang som värde</returns>
    /// <exception cref="ArgumentException">Kastas om ett eller flera abonnemang inte finns i databasen.</exception>
    private async Task<Dictionary<int, Abonnemang>> GetAndValidateAbonnemang(List<int> abonnemangIds)
    {
        List<int> uniqueAbonnemangIds = abonnemangIds.Distinct().ToList();
        Dictionary<int, Abonnemang> selectedAbonnemangs = await abonnemangRepository.GetAbonnemangByIdsFromDatabaseToDictionary(uniqueAbonnemangIds);

        if (uniqueAbonnemangIds.Count != selectedAbonnemangs.Count) throw new ArgumentException("Tekniskt fel: Ett abonnemang i varukorgen hittades inte i systemet. Kontakta support om problemet kvarstår.");

        return selectedAbonnemangs;
    }

    /// <summary>
    /// Hämtar och validerar telefoner baserat på en lista med telefoner i varukorgen.
    /// </summary>
    /// <param name="phonesInCart">Lista med telefoner från varukorgen.</param>
    /// <returns>En dictionary med telefon-ID som nyckel och telefon som värde, eller tom dictionary om inga telefoner finns.</returns>
    /// <exception cref="ArgumentException">Kastas om en eller flera telefoner inte finns i databasen.</exception>
    private async Task<Dictionary<int, Phone>> GetAndValidatePhones(List<PhoneInCartDto> phonesInCart)
    {
        if (phonesInCart.Count == 0) return new Dictionary<int, Phone>();

        List<int> uniquePhoneIds = phonesInCart.Select(p => p.PhoneId).Distinct().ToList();
        List<Phone> phones = await phoneRepository.GetPhonesByIdsFromDatabase(uniquePhoneIds);

        if (uniquePhoneIds.Count != phones.Count) throw new ArgumentException("Tekniskt fel: En telefon i varukorgen hittades inte i systemet. Kontakta support om problemet kvarstår.");

        return phones.ToDictionary(p => p.Id);
    }

    /// <summary>
    /// Påbörjar skapandet av order med information om användaren
    /// </summary>
    /// <param name="user">Användaren som ska registrera ordern</param>
    /// <param name="contractType">Vilken typ av kontrakt (Abonnemang, Bredband, TV)</param>
    /// <returns>En påbörjad order med inga kontrakt</returns>
    private Order CreateNewOrder(User user, ContractType contractType)
    {
        return new Order
        {
            UserId = user.Id,
            StoreId = user.StoreId,
            ContractType = contractType,
            Contracts = new List<Contract>()
        };
    }

    /// <summary>
    /// Påbörjar skapandet av kontrakt med information om abonnemanget
    /// </summary>
    /// <param name="abonnemang">Det valda abonnemanget</param>
    /// <param name="contractCodesDto">Kontraktkoderna för detta abonnemang</param>
    /// <returns>En påbörjat kontrakt med inga telefoner</returns>
    private Contract CreateContractFromAbonnemang(Abonnemang abonnemang, ContractCodeListDto contractCodesDto)
    {
        return new Contract
        {
            AbonnemangId = abonnemang.Id,
            Name = abonnemang.Name,
            MonthlyPrice = abonnemang.MonthlyPrice,
            MonthlyDiscount = abonnemang.MonthlyDiscount,
            MonthlyDiscountDuration = abonnemang.MonthlyDiscountDuration,
            Bindningstid = abonnemang.Bindningstid,
            Provision = abonnemang.Provision,
            ExtraSurf = abonnemang.ExtraSurf,
            IsFokus = abonnemang.IsFokus,
            OperatorId = abonnemang.OperatorId,
            OperatorName = abonnemang.Operator.Name,
            OperatorLogoUrl = abonnemang.Operator.LogoUrl,
            ContractCodes = JsonSerializer.Serialize(contractCodesDto.Codes)
        };
    }

    private Contract CreateContractFromBredband(Bredband bredband, ContractCodeListDto contractCodesDto)
    {
        return new Contract
        {
            BredbandId = bredband.Id,
            Name = bredband.Name,
            Bindningstid = bredband.Bindningstid,
            Provision = bredband.Provision,
            OperatorId = bredband.OperatorId,
            OperatorName = bredband.Operator.Name,
            OperatorLogoUrl = bredband.Operator.LogoUrl,
            ContractCodes = JsonSerializer.Serialize(contractCodesDto.Codes)
        };
    }

    private Contract CreateContractFromTvStreaming(TvStreaming tvStreaming, ContractCodeListDto contractCodesDto)
    {
        return new Contract
        {
            TvStreamingId = tvStreaming.Id,
            Name = tvStreaming.Name,
            Bindningstid = tvStreaming.Bindningstid,
            Provision = tvStreaming.Provision,
            OperatorId = tvStreaming.OperatorId,
            OperatorName = tvStreaming.Operator.Name,
            OperatorLogoUrl = tvStreaming.Operator.LogoUrl,
            ContractCodes = JsonSerializer.Serialize(contractCodesDto.Codes)
        };
    }

    /// <summary>
    /// Lägger till den valda telefonen till kontraktet
    /// </summary>
    /// <param name="contract">Kontraktet telefonen ska läggas till på</param>
    /// <param name="phoneInCart">Information om telefonen från frontend</param>
    /// <param name="selectedPhones">Lista med telefoner som valts</param>
    private void AddPhoneToContract(Contract contract, PhoneInCartDto phoneInCart, Dictionary<int, Phone> selectedPhones)
    {
        Phone phone = selectedPhones[phoneInCart.PhoneId];

        contract.PhoneId = phone.Id;
        contract.IsDelbetalning = phoneInCart.IsDelbetalning;
        contract.PhoneCostAfterDiscount = phoneInCart.Price;
        contract.PhoneBrand = phone.Brand;
        contract.PhoneModel = phone.Model;
        contract.PhoneStorage = phone.Storage;
        contract.PhoneColor = phone.Color;
        contract.PhonePrice = phone.Price;
        contract.PhoneCode = phone.Code;
        contract.ImageUrl = phone.Img;
    }

    /// <summary>
    /// Makulerar kontrakt kopplat till en befintlig order
    /// </summary>
    /// <param name="orderId">ID kopplat till ordern</param>
    /// <param name="user">Användaren som makulerar ordern</param>
    /// <param name="contractIdsToCancel">De kontrakt som ska makuleras</param>
    /// <param name="reason">Anledning till makulering</param>
    /// <returns>True om makuleringen lyckas, annars false</returns>
    public async Task<bool> CancelOrder(int orderId, User user, List<int> contractIdsToCancel, string reason)
    {
        if (string.IsNullOrWhiteSpace(reason)) throw new ArgumentException("En anledning måste anges vid makulering.");
        if (!contractIdsToCancel.Any()) throw new ArgumentException("Minst ett kontrakt måste anges vid makulering.");

        Order? order = await orderRepository.GetOrderToCancelFromDatabase(orderId) ?? throw new KeyNotFoundException($"Ordern som ska makuleras hittades inte i systemet. Kontakta support om problemet kvarstår.");
        if (order.Status == OrderStatus.Cancelled) throw new InvalidOperationException("Den valda ordern är redan makulerad. Kontakta support om problem uppstår.");

        bool canCancel = (user.Role == UserRole.Sales && order.UserId == user.Id && user.StoreId == order.StoreId) || (user.Role == UserRole.Manager && user.StoreId == order.StoreId) || (user.Role == UserRole.Admin);
        if (!canCancel) throw new UnauthorizedAccessException("Du har inte behörighet att makulera denna order. Kontakta support om du anser att detta är inkorrekt.");

        List<int> contractIds = order.Contracts.Select(c => c.Id).ToList();
        List<int> invalidIds = contractIdsToCancel.Except(contractIds).ToList();
        if (invalidIds.Any()) throw new ArgumentException("Ett eller flera angivna kontrakt hittades inte på denna order.");

        List<Contract> contractsToCancel = order.Contracts.Where(c => contractIdsToCancel.Contains(c.Id)).ToList();

        List<Contract> alreadyCancelled = contractsToCancel.Where(c => c.Status == ContractStatus.Cancelled).ToList();
        if(alreadyCancelled.Any()) throw new InvalidOperationException($"Ett eller flera av de valda kontrakten är redan makulerade.");
        
        DateTime cancelledAt = DateTimeHelper.GetSwedishTime();
        foreach (Contract contract in contractsToCancel)
        {
            contract.Status = ContractStatus.Cancelled;
            contract.CancelledByUserId = user.Id;
            contract.CancellationReason = reason;
            contract.CancelledAt = cancelledAt;
        }

        if (order.Contracts.All(c => c.Status == ContractStatus.Cancelled))
        {
            order.Status = OrderStatus.Cancelled;
        }

        else
        {
            order.Status = OrderStatus.Combined;
        }

        await orderRepository.UpdateOrderInDatabase(order);
        return true;
    }

    /// <summary>
    /// Hämtar en specifik order med tillhörande information
    /// </summary>
    /// <param name="id">ID för ordern som ska hämtas</param>
    /// <returns>Ordern med tillhörande information, eller null om ordern inte finns</returns>
    /// <exception cref="KeyNotFoundException">Kastas när ordern inte hittas</exception>
    public async Task<Order?> GetOrderById(int id)
    {
        Order? order = await orderRepository.GetOrderByIdFromDatabase(id);
        if (order is null) throw new KeyNotFoundException($"Ordern med ID: {id} hittades inte i systemet. Kontakta support om problemet kvarstår.");

        return order;
    }

    /// <summary>
    /// Hämtar en paginerad lista med ordrar för orderhistorik
    /// </summary>
    /// <param name="page">Sidnummer</param>
    /// <param name="storeId">ID för varuhuset</param>
    /// <param name="pageSize">Antal ordrar per sida</param>
    /// <returns>En paginerad lista med ordrar</returns>
    public async Task<OrderPageDto> GetOrdersPaginated(int storeId, int page, int pageSize = 10)
    {
        if (pageSize <= 0) throw new ArgumentOutOfRangeException("Sidnummer måste vara större än 0.");

        List<Order> orders = await orderRepository.GetOrdersPaginatedFromDatabase(storeId, page, pageSize);
        List<OrderDto> ordersDto = mapper.Map<List<OrderDto>>(orders);

        int totalOrders = await orderRepository.GetTotalOrdersFromDatabase(storeId);

        return new OrderPageDto
        {
            PageNumber = page,
            TotalCount = totalOrders,
            Orders = ordersDto,
        };
    }
}
