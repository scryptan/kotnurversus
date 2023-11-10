using Models;

namespace Domain;

public class VoidDomainResult
{
    public static readonly VoidDomainResult Success = new VoidDomainResult();
}

public class VoidDomainResult<TErrorStatus> : VoidDomainResult<TErrorStatus, ErrorInfo<TErrorStatus>>
    where TErrorStatus : struct, Enum
{
    private static readonly VoidDomainResult<TErrorStatus> success = new VoidDomainResult<TErrorStatus>();

    public static implicit operator VoidDomainResult<TErrorStatus>(VoidDomainResult _) => success;

    public static implicit operator VoidDomainResult<TErrorStatus>(ErrorInfo<TErrorStatus> errorInfo)
    {
        return new VoidDomainResult<TErrorStatus>
        {
            ErrorInfo = errorInfo
        };
    }
}

public class VoidDomainResult<TErrorStatus, TErrorInfo>
    where TErrorInfo : ErrorInfo<TErrorStatus>
    where TErrorStatus : struct, Enum
{
    private static readonly VoidDomainResult<TErrorStatus, TErrorInfo> success = new VoidDomainResult<TErrorStatus, TErrorInfo>();

    public TErrorInfo? ErrorInfo { get; protected set; }

    public static implicit operator VoidDomainResult<TErrorStatus, TErrorInfo>(VoidDomainResult _) => success;

    public static implicit operator VoidDomainResult<TErrorStatus, TErrorInfo>(TErrorInfo errorInfo)
    {
        return new VoidDomainResult<TErrorStatus, TErrorInfo>
        {
            ErrorInfo = errorInfo
        };
    }
}