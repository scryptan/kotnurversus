namespace Domain.Context;

public static class ContextHolder
{
    private static readonly AsyncLocal<ContextData?> currentContext = new();

    public static ContextData? Current
    {
        get => currentContext.Value;
        private set => currentContext.Value = value;
    }

    public static IDisposable ChangeContext(Action<ContextData> change)
    {
        var prevContext = Current;
        var nextContext = Current?.ShallowCopy() ?? new ContextData();
        change(nextContext);
        Current = nextContext;
        return new DisposeHandle(() => Current = prevContext);
    }

    private class DisposeHandle : IDisposable
    {
        private readonly Action onDispose;
        public DisposeHandle(Action onDispose) => this.onDispose = onDispose;
        public void Dispose() => onDispose();
    }
}