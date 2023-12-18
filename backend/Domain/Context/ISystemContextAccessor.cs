using System.Security.Claims;

namespace Domain.Context;

public interface ISystemContextAccessor
{
    IDisposable SetSystemContext(string caller, ClaimsPrincipal user);
}