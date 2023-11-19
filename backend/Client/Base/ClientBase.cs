using Models;
using Vostok.Clusterclient.Core;
using Vostok.Clusterclient.Core.Model;

namespace Client.Base;

internal abstract class ClientBase
{
    private readonly IClusterClient clusterClient;

    protected ClientBase(IClusterClient clusterClient)
    {
        this.clusterClient = clusterClient;
    }

    protected async Task<OperationResult<T>> SendRequestAsync<T>(Request request)
        where T : class
    {
        using var clusterResult = await SendAsync(request).ConfigureAwait(false);

        if (!clusterResult.Response.IsSuccessful)
            return OperationResult<T>.Error(clusterResult.Response.Code, clusterResult.Response.Content.ToString());

        var result = RequestHelpers.Deserialize<T>(clusterResult.Response.Content.ToString()!);
        return OperationResult<T>.Success(result);
    }

    protected Task<ClusterResult> SendAsync(Request request)
    {
        return clusterClient.SendAsync(request);
    }

    protected async Task<VoidOperationResult> SendVoidRequestAsync(Request request)
    {
        using var clusterResult = await SendAsync(request).ConfigureAwait(false);

        return clusterResult.Response.IsSuccessful
            ? VoidOperationResult.Success()
            : VoidOperationResult.Error(clusterResult.Response.Code, clusterResult.Response.Content.ToString());
    }

    protected async Task<OperationResult<T, TErrorStatus>> SendRequestAsync<T, TErrorStatus>(Request request)
        where TErrorStatus : struct, Enum
        where T : class
    {
        using var clusterResult = await SendAsync(request).ConfigureAwait(false);

        if (clusterResult.Response.Code == ResponseCode.Conflict)
        {
            var errorInfo = RequestHelpers.Deserialize<ErrorInfo<TErrorStatus>>(clusterResult.Response.Content.ToString()!);
            return OperationResult<T, TErrorStatus>.Conflict(errorInfo);
        }

        if (!clusterResult.Response.IsSuccessful)
            return OperationResult<T, TErrorStatus>.Error(clusterResult.Response.Code, clusterResult.Response.Content.ToString());

        var result = RequestHelpers.Deserialize<T>(clusterResult.Response.Content.ToString()!);
        return OperationResult<T, TErrorStatus>.Success(result);
    }

    protected async Task<VoidOperationResult<TErrorStatus>> SendVoidRequestAsync<TErrorStatus>(Request request)
        where TErrorStatus : struct, Enum
    {
        using var clusterResult = await SendAsync(request).ConfigureAwait(false);

        if (clusterResult.Response.Code == ResponseCode.Conflict)
        {
            var errorInfo = RequestHelpers.Deserialize<ErrorInfo<TErrorStatus>>(clusterResult.Response.Content.ToString()!);
            return VoidOperationResult<TErrorStatus>.Conflict(errorInfo);
        }

        return clusterResult.Response.IsSuccessful
            ? VoidOperationResult<TErrorStatus>.Success()
            : VoidOperationResult<TErrorStatus>.Error(clusterResult.Response.Code, clusterResult.Response.Content.ToString());
    }

    protected async Task<OperationResult<T, TErrorStatus, TErrorInfo>> SendRequestAsync<T, TErrorStatus, TErrorInfo>(Request request)
        where TErrorStatus : struct, Enum
        where TErrorInfo : ErrorInfo<TErrorStatus>
        where T : class
    {
        using var clusterResult = await SendAsync(request).ConfigureAwait(false);

        if (clusterResult.Response.Code == ResponseCode.Conflict)
        {
            var errorContent = clusterResult.Response.Content.ToString();
            var errorInfo = RequestHelpers.Deserialize<TErrorInfo>(errorContent!);
            return OperationResult<T, TErrorStatus, TErrorInfo>.Conflict(errorInfo);
        }

        if (!clusterResult.Response.IsSuccessful)
            return OperationResult<T, TErrorStatus, TErrorInfo>.Error(clusterResult.Response.Code, clusterResult.Response.Content.ToString());

        var content = clusterResult.Response.Content.ToString();
        var result = RequestHelpers.Deserialize<T>(content!);
        return OperationResult<T, TErrorStatus, TErrorInfo>.Success(result);
    }

    protected async Task<VoidOperationResult<TErrorStatus, TErrorInfo>> SendVoidRequestAsync<TErrorStatus, TErrorInfo>(Request request)
        where TErrorStatus : struct, Enum
        where TErrorInfo : ErrorInfo<TErrorStatus>
    {
        using var clusterResult = await SendAsync(request).ConfigureAwait(false);

        if (clusterResult.Response.Code == ResponseCode.Conflict)
        {
            var errorInfo = RequestHelpers.Deserialize<TErrorInfo>(clusterResult.Response.Content.ToString()!);
            return VoidOperationResult<TErrorStatus, TErrorInfo>.Conflict(errorInfo);
        }

        return clusterResult.Response.IsSuccessful
            ? VoidOperationResult<TErrorStatus, TErrorInfo>.Success()
            : VoidOperationResult<TErrorStatus, TErrorInfo>.Error(clusterResult.Response.Code, clusterResult.Response.Content.ToString());
    }
}