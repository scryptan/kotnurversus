using Microsoft.AspNetCore.JsonPatch;
using Models;
using Vostok.Clusterclient.Core;
using Vostok.Clusterclient.Core.Model;
using Vostok.Logging.Abstractions;

namespace Client.Base;

internal abstract class BaseEntityClient<T, TCreationArgs, TInvalidDataReason> : ClientBase, IBaseClient<T, TCreationArgs, TInvalidDataReason>
    where TInvalidDataReason : struct, Enum
    // where TSearchRequest : class, ISearchRequest
    where TCreationArgs : EntityCreationArgs
    where T : class
{
    protected readonly IClusterClient Client;
    protected readonly ILog Log;
    protected string Route;

    protected BaseEntityClient(IClusterClient client, ILog log, string route)
        : base(client)
    {
        Client = client;
        Log = log;
        Route = route;
    }

    public async Task<OperationResult<T, TInvalidDataReason>> GetAsync(Guid id)
    {
        var request = Request.Get($"{Route}/{id}");
        var res = await SendRequestAsync<T, TInvalidDataReason>(request);
        return res;
    }

    public async Task<OperationResult<T, TInvalidDataReason>> CreateAsync(TCreationArgs creationArgs)
    {
        var request = Request
            .Post($"{Route}")
            .WithJsonContent(creationArgs);

        var res = await SendRequestAsync<T, TInvalidDataReason>(request);
        return res;
    }

    public async Task<OperationResult<T, TInvalidDataReason>> PatchAsync(Guid id, JsonPatchDocument<T> patch)
    {
        var request = Request
            .Patch($"{Route}")
            .WithJsonContent(patch);

        var res = await SendRequestAsync<T, TInvalidDataReason>(request);
        return res;
    }

    public async Task<VoidOperationResult> DeleteAsync(Guid id)
    {
        var request = Request.Delete($"{Route}/{id}");
        var res = await SendVoidRequestAsync(request);
        return res;
    }
}