namespace Models;

public class ErrorInfo<TStatus> where TStatus : struct, Enum
{
    public ErrorInfo(TStatus status, string message)
    {
        Status = status;
        Message = message;
    }

    public TStatus Status { get; set; }
    public string Message { get; set; }

    public override string ToString() => $"{nameof(Status)}: {Status}, {nameof(Message)}: {Message}";
}