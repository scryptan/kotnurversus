using System.Security.Claims;

namespace Domain.Context;

public class ContextAccessor : ISystemContextAccessor
{
    public IDisposable SetSystemContext(string caller, ClaimsPrincipal user)
    {
        return ContextHolder.ChangeContext(x =>
        {
            x.Caller = caller;
            x.User = user;
        });
    }
}