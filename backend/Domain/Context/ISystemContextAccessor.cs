namespace Domain.Context;

public interface ISystemContextAccessor
{
    IDisposable SetSystemContext(string caller);
}