using System.Security.Claims;
using Db;

namespace Domain.Context;

public class ContextProvider : ISystemDataContext
{
    public string Caller => ContextHolder.Current?.Caller ?? throw new InvalidOperationException($"{nameof(ContextData.Caller)} is not set in context data");
    public Dictionary<object, object?> Cache => ContextHolder.Current?.Cache ?? throw new InvalidOperationException($"{nameof(ContextData.Cache)} is not set in context data");
    public DbContext DbContext => ContextHolder.Current?.DbContext ?? throw new InvalidOperationException($"{nameof(ContextData.DbContext)} is not set in context data");
    public DateTimeOffset Now => ContextHolder.Current?.Now ?? throw new InvalidOperationException($"{nameof(ContextData.Now)} is not set in context data");
    public ClaimsPrincipal? User => ContextHolder.Current?.User;
}