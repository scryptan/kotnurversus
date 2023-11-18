using Models;
using Vostok.Clusterclient.Core.Model;

namespace Client;

public class VoidOperationResult
{
    protected VoidOperationResult(ResponseCode responseCode, string? errorText)
    {
        ResponseCode = responseCode;
        ErrorText = errorText;
    }

    public bool IsSuccessful => ResponseCode.IsSuccessful();

    public ResponseCode ResponseCode { get; }

    public string? ErrorText { get; }

    public virtual void EnsureSuccess()
    {
        if (!ResponseCode.IsSuccessful() && !ResponseCode.IsRedirection())
            throw new ApiClientException(ResponseCode, ErrorText);
    }

    internal static VoidOperationResult Error(ResponseCode responseCode, string? errorText)
    {
        return new VoidOperationResult(responseCode, errorText);
    }

    internal static VoidOperationResult Success(ResponseCode responseCode = ResponseCode.Ok)
    {
        if (!responseCode.IsSuccessful())
            throw new InvalidOperationException($"Couldn't create successful {nameof(VoidOperationResult)} with unsuccessful response code {responseCode}");
        return new VoidOperationResult(responseCode, errorText: null);
    }
}

public class VoidOperationResult<TErrorStatus, TErrorInfo> : VoidOperationResult
    where TErrorStatus : struct, Enum
    where TErrorInfo : ErrorInfo<TErrorStatus>
{
    protected VoidOperationResult(ResponseCode responseCode, TErrorInfo? errorInfo, string? errorText)
        : base(responseCode, errorText)
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

    internal new static VoidOperationResult<TErrorStatus, TErrorInfo> Error(ResponseCode responseCode, string? errorText)
    {
        return new VoidOperationResult<TErrorStatus, TErrorInfo>(responseCode, errorInfo: null, errorText);
    }

    internal static VoidOperationResult<TErrorStatus, TErrorInfo> Conflict(TErrorInfo errorInfo)
    {
        return new VoidOperationResult<TErrorStatus, TErrorInfo>(ResponseCode.Conflict, errorInfo, errorText: null);
    }

    internal new static VoidOperationResult<TErrorStatus, TErrorInfo> Success(ResponseCode responseCode = ResponseCode.Ok)
    {
        if (!responseCode.IsSuccessful())
            throw new InvalidOperationException($"Couldn't create successful {nameof(VoidOperationResult)} with unsuccessful response code {responseCode}");
        return new VoidOperationResult<TErrorStatus, TErrorInfo>(responseCode, errorInfo: null, errorText: null);
    }
}

public class VoidOperationResult<TErrorStatus> : VoidOperationResult<TErrorStatus, ErrorInfo<TErrorStatus>>
    where TErrorStatus : struct, Enum
{
    public VoidOperationResult(ResponseCode responseCode, ErrorInfo<TErrorStatus>? errorInfo, string? errorText)
        : base(responseCode, errorInfo, errorText)
    {
    }

    public new static VoidOperationResult<TErrorStatus> Error(ResponseCode responseCode, string? errorText)
    {
        return new VoidOperationResult<TErrorStatus>(responseCode, errorInfo: null, errorText);
    }

    public new static VoidOperationResult<TErrorStatus> Conflict(ErrorInfo<TErrorStatus> errorInfo)
    {
        return new VoidOperationResult<TErrorStatus>(ResponseCode.Conflict, errorInfo, errorText: null);
    }

    public new static VoidOperationResult<TErrorStatus> Success(ResponseCode responseCode = ResponseCode.Ok)
    {
        if (!responseCode.IsSuccessful())
            throw new InvalidOperationException($"Couldn't create successful {nameof(VoidOperationResult)} with unsuccessful response code {responseCode}");
        return new VoidOperationResult<TErrorStatus>(responseCode, errorInfo: null, errorText: null);
    }
}