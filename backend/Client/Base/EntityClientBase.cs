using Microsoft.AspNetCore.JsonPatch;
using Models;
using Models.Search;
using Vostok.Clusterclient.Core;
using Vostok.Clusterclient.Core.Model;
using Vostok.Logging.Abstractions;

namespace Client.Base;

internal abstract class EntityClientBase<T, TCreationArgs, TSearchRequest, TInvalidDataReason> : ClientBase, IClientBase<T, TCreationArgs, TSearchRequest, TInvalidDataReason>
    where TInvalidDataReason : struct, Enum
    where TSearchRequest : SearchRequestBase, ISearchRequest
    where TCreationArgs : EntityCreationArgs
    where T : class
{
    protected readonly IClusterClient Client;
    protected readonly ILog Log;
    protected string Route;

    protected EntityClientBase(IClusterClient client, ILog log, string route)
        : base(client)
    {
        Client = client;
        Log = log;
        Route = $"api/v1/{route}";
    }

    public async Task<OperationResult<T, AccessSingleEntityError>> GetAsync(Guid id)
    {
        var request = Request.Get($"{Route}/{id}");

        var res = await SendRequestAsync<T, AccessSingleEntityError>(request);
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
            .Patch($"{Route}/{id}")
            .WithJsonContent(patch);

        var res = await SendRequestAsync<T, TInvalidDataReason>(request);
        return res;
    }

    public async Task<VoidOperationResult<AccessSingleEntityError>> DeleteAsync(Guid id)
    {
        var request = Request.Delete($"{Route}/{id}");

        var res = await SendVoidRequestAsync<AccessSingleEntityError>(request);
        return res;
    }

    public async Task<OperationResult<SearchResult<T>, AccessMultipleEntitiesError>> SearchAsync(TSearchRequest? searchRequest = null)
    {
        var request = Request
            .Get($"{Route}")
            .WithFieldFilter(searchRequest);

        var res = await SendRequestAsync<SearchResult<T>, AccessMultipleEntitiesError>(request);
        return res;
    }
}