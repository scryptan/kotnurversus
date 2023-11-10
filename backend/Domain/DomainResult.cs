using Models;

namespace Domain;

public class DomainResult<T, TErrorStatus> : DomainResult<T, TErrorStatus, ErrorInfo<TErrorStatus>>
    where T : class
    where TErrorStatus : struct, Enum
{
    public new DomainResult<T2, TErrorStatus> Cast<T2>(Func<T, T2> map)
        where T2 : class
    {
        return new DomainResult<T2, TErrorStatus>
        {
            Result = Result == null ? null : map(Result),
            ErrorInfo = ErrorInfo
        };
    }

    public static implicit operator DomainResult<T, TErrorStatus>(T result)
    {
        return new DomainResult<T, TErrorStatus>
        {
            Result = result
        };
    }

    public static implicit operator DomainResult<T, TErrorStatus>(ErrorInfo<TErrorStatus> errorInfo)
    {
        return new DomainResult<T, TErrorStatus>
        {
            ErrorInfo = errorInfo
        };
    }
}

public class DomainResult<T, TErrorStatus, TErrorInfo>
    where T : class
    where TErrorInfo : ErrorInfo<TErrorStatus>
    where TErrorStatus : struct, Enum
{
    public T? Result { get; protected set; }

    public TErrorInfo? ErrorInfo { get; protected set; }

    public DomainResult<T2, TErrorStatus, TErrorInfo> Cast<T2>(Func<T, T2> map)
        where T2 : class
    {
        return new DomainResult<T2, TErrorStatus, TErrorInfo>
        {
            Result = Result == null ? null : map(Result),
            ErrorInfo = ErrorInfo
        };
    }

    public static implicit operator DomainResult<T, TErrorStatus, TErrorInfo>(T result)
    {
        return new DomainResult<T, TErrorStatus, TErrorInfo>
        {
            Result = result
        };
    }

    public static implicit operator DomainResult<T, TErrorStatus, TErrorInfo>(TErrorInfo errorInfo)
    {
        return new DomainResult<T, TErrorStatus, TErrorInfo>
        {
            ErrorInfo = errorInfo
        };
    }
}