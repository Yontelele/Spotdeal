using System.Runtime.InteropServices;

namespace api.Helpers;

/// <summary>
/// En hjälpklass för att hämta svensk lokal tid
/// </summary>
public static class DateTimeHelper
{
    /// <summary>
    /// Tidszonen som representerar svensk tid
    /// </summary>
    private static readonly TimeZoneInfo SwedishTimeZone;

    /// <summary>
    /// Konstruktor som laddar rätt tidszon för Sverige beroende på operativsystem
    /// </summary>
    static DateTimeHelper()
    {
        string timeZoneId;

        if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
        {
            timeZoneId = "W. Europe Standard Time"; // Tidszon för Sverige på Windows
        }
        else
        {
            timeZoneId = "Europe/Stockholm"; // Tidszon för Sverige på Linux och andra operativsystem
        }

        try
        {
            SwedishTimeZone = TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
        }
        catch (TimeZoneNotFoundException)
        {
            throw new InvalidOperationException($"Tidszonen '{timeZoneId}' kunde inte hittas på detta operativsystem.");
        }
    }

    /// <summary>
    /// Hämtar tid i svensk tidszon
    /// </summary>
    /// <returns>DateTime som representerar aktuell svensk tid</returns>
    public static DateTime GetSwedishTime()
    {
        return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, SwedishTimeZone);
    }
}
