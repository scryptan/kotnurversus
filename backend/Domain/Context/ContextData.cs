using System.Security.Claims;
using Db;

namespace Domain.Context;

public class ContextData
{
    public string? Caller { get; set; }
    public DbContext? DbContext { get; set; }
    public Dictionary<object, object?>? Cache { get; set; }
    public DateTimeOffset? Now { get; set; }
    public ClaimsPrincipal? User { get; set; }

    public ContextData ShallowCopy()
    {
        return (ContextData)MemberwiseClone();
    }
}