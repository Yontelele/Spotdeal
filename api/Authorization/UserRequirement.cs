using Microsoft.AspNetCore.Authorization;

namespace api.Authorization;

/// <summary>
/// Krav för auktorisering som säkerställer att användaren finns i databasen
/// </summary>
public class UserRequirement : IAuthorizationRequirement { }
