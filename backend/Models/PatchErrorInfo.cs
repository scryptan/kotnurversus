namespace Models;

public class PatchErrorInfo<TStatus, TReason> : ErrorInfo<TStatus>
    where TStatus : struct, Enum
    where TReason : struct, Enum
{
    public PatchErrorInfo(TStatus status, string message)
        : base(status, message)
    {
    }

    public List<InvalidData<TReason>> InvalidDatas { get; set; } = new();

    public override string ToString() =>
        $"{base.ToString()}; " +
        $"InvalidDatas: [{string.Join("; ", InvalidDatas)}]; ";
}