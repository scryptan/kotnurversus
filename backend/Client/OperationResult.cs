using Models;
using Vostok.Clusterclient.Core.Model;

namespace Client;

public class OperationResult<TResult>
    where TResult : class
{
    private readonly TResult? result;

    protected OperationResult(TResult? result, ResponseCode responseCode, string? errorText)
    {
        ResponseCode = responseCode;
        ErrorText = errorText;
        this.result = result;
    }

    public bool IsSuccessful => ResponseCode.IsSuccessful();

    public ResponseCode ResponseCode { get; }

    public string? ErrorText { get; }

    public TResult Result
    {
        get
        {
            EnsureSuccess();
            return result ?? throw new InvalidOperationException("Result is null");
        }
    }

    public virtual void EnsureSuccess()
    {
        if (!ResponseCode.IsSuccessful() && !ResponseCode.IsRedirection())
            throw new ApiClientException(ResponseCode, ErrorText);
    }

    internal static OperationResult<TResult> Error(ResponseCode responseCode, string? errorText)
    {
        return new OperationResult<TResult>(default, responseCode, errorText);
    }

    internal static OperationResult<TResult> Success(TResult result, ResponseCode responseCode = ResponseCode.Ok)
    {
        if (!responseCode.IsSuccessful() && !responseCode.IsRedirection())
            throw new InvalidOperationException($"Couldn't create successful {nameof(OperationResult<TResult>)} with unsuccessful response code {responseCode}");
        return new OperationResult<TResult>(result, responseCode, errorText: null);
    }
}

public class OperationResult<TResult, TErrorStatus, TErrorInfo> : OperationResult<TResult>
    where TResult : class
    where TErrorStatus : struct, Enum
    where TErrorInfo : ErrorInfo<TErrorStatus>
{
    protected OperationResult(TResult? result, ResponseCode responseCode, TErrorInfo? errorInfo, string? errorText)
        : base(result, responseCode, errorText)
    {
        ErrorInfo = errorInfo;
    }

    public TErrorInfo? ErrorInfo { get; }

    public TErrorInfo EnsureErrorInfo()
    {
        return ErrorInfo ?? throw new ApiClientException(ResponseCode, ErrorText);
    }

    public override void EnsureSuccess()
    {
        if (ErrorInfo != null)
            throw new ApiClientException(ResponseCode, ErrorInfo.ToString());
        base.EnsureSuccess();
    }

    internal new static OperationResult<TResult, TErrorStatus, TErrorInfo> Error(ResponseCode responseCode, string? errorText)
    {
        return new OperationResult<TResult, TErrorStatus, TErrorInfo>(default, responseCode, errorInfo: null, errorText);
    }

    internal static OperationResult<TResult, TErrorStatus, TErrorInfo> Conflict(TErrorInfo errorInfo)
    {
        return new OperationResult<TResult, TErrorStatus, TErrorInfo>(default, ResponseCode.Conflict, errorInfo, errorText: null);
    }

    internal new static OperationResult<TResult, TErrorStatus, TErrorInfo> Success(TResult result, ResponseCode responseCode = ResponseCode.Ok)
    {
        if (!responseCode.IsSuccessful() && !responseCode.IsRedirection())
            throw new InvalidOperationException($"Couldn't create successful {nameof(OperationResult<TResult>)} with unsuccessful response code {responseCode}");
        return new OperationResult<TResult, TErrorStatus, TErrorInfo>(result, responseCode, errorInfo: null, errorText: null);
    }
}

public class OperationResult<TResult, TErrorStatus> : OperationResult<TResult, TErrorStatus, ErrorInfo<TErrorStatus>>
    where TResult : class
    where TErrorStatus : struct, Enum
{
    private OperationResult(TResult? result, ResponseCode responseCode, ErrorInfo<TErrorStatus>? errorInfo, string? errorText)
        : base(result, responseCode, errorInfo, errorText)
    {
    }

    internal new static OperationResult<TResult, TErrorStatus> Error(ResponseCode responseCode, string? errorText)
    {
        return new OperationResult<TResult, TErrorStatus>(default, responseCode, errorInfo: null, errorText);
    }

    internal new static OperationResult<TResult, TErrorStatus> Conflict(ErrorInfo<TErrorStatus> errorInfo)
    {
        return new OperationResult<TResult, TErrorStatus>(default, ResponseCode.Conflict, errorInfo, errorText: null);
    }

    internal new static OperationResult<TResult, TErrorStatus> Success(TResult result, ResponseCode responseCode = ResponseCode.Ok)
    {
        if (!responseCode.IsSuccessful() && !responseCode.IsRedirection())
            throw new InvalidOperationException($"Couldn't create successful {nameof(OperationResult<TResult>)} with unsuccessful response code {responseCode}");
        return new OperationResult<TResult, TErrorStatus>(result, responseCode, errorInfo: null, errorText: null);
    }
}