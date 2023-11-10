namespace Models;

public class InvalidData<TReason>
    where TReason : struct, Enum
{
    public InvalidData(string path, object? value, TReason reason)
    {
        Path = path;
        Value = value;
        Reason = reason;
    }

    public string Path { get; }
    public object? Value { get; }
    public TReason Reason { get; }

    public override string ToString() => $"{nameof(Path)}: {Path}, {nameof(Value)}: {Value}, {nameof(Reason)}: {Reason}";
}

public static class InvalidData
{
    public static InvalidData<TReason> Create<TReason>(string path, object? value, TReason reason)
        where TReason : struct, Enum
    {
        return new InvalidData<TReason>(path, value, reason);
    }
}