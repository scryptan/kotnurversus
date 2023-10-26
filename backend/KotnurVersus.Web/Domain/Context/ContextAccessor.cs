namespace Domain.Context;

public class ContextAccessor : ISystemContextAccessor
{
    public IDisposable SetSystemContext(string caller)
    {
        return ContextHolder.ChangeContext(x => x.Caller = caller);
    }
}