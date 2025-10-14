using api.AdminDto;
using api.Dto;
using api.Models;
using AutoMapper;
using System.Text.Json;

namespace api.Mappings;

/// <summary>
/// Profil för automapper
/// </summary>
public class MappingProfile : Profile
{
    /// <summary>
    /// Bestämmer hur olika objekt ska mappa mot varandra.
    /// </summary>
    public MappingProfile()
    {
        CreateMap<Abonnemang, AbonnemangDto>();

        CreateMap<Bredband, BredbandDto>();

        CreateMap<Budget, BudgetDto>();

        CreateMap<Contract, ContractDto>().ForMember(dest => dest.ContractCodes, opt => opt.ConvertUsing(new ContractCodesConverter(), src => src.ContractCodes));
        
        CreateMap<Company, CompanyDto>();

        CreateMap<Operator, OperatorDto>();
        
        CreateMap<Order, OrderDto>();
        
        CreateMap<SpotDeal, SpotDealDto>();

        CreateMap<Store, StoreDto>();

        CreateMap<TvStreaming, TvStreamingDto>();

        CreateMap<User, UserDto>();

        CreateMap<User, AdminUserDto>();
    }
}

/// <summary>
/// Konverterar kontraktkoder (string) till ContractCodeDto (JSON)
/// </summary>
public class ContractCodesConverter : IValueConverter<string, List<ContractCodeDto>>
{
    /// <summary>
    /// Konverterar en JSON-sträng till en lista av ContractCodeDto
    /// </summary>
    /// <param name="source">JSON-strängen från ContractCodes</param>
    /// <param name="context">Kontext för mappningen</param>
    /// <returns>En lista av ContractCodeDto, eller tom lista om konvertering misslyckas</returns>
    public List<ContractCodeDto> Convert(string source, ResolutionContext context)
    {
        if (string.IsNullOrEmpty(source)) return new List<ContractCodeDto>();

        return JsonSerializer.Deserialize<List<ContractCodeDto>>(source) ?? new List<ContractCodeDto>();
    }
}