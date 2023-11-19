using Microsoft.AspNetCore.JsonPatch;
using Models;
using Models.Search;

namespace Client.Base;

public interface IClientBase<T, in TCreationArgs, in TSearchRequest, TInvalidDataReason>
    where TInvalidDataReason : struct, Enum
    where TSearchRequest : SearchRequestBase, ISearchRequest
    where TCreationArgs : EntityCreationArgs
    where T : class
{
    Task<OperationResult<T, AccessSingleEntityError>> GetAsync(Guid id);
    Task<OperationResult<T, TInvalidDataReason>> CreateAsync(TCreationArgs creationArgs);
    Task<OperationResult<T, TInvalidDataReason>> PatchAsync(Guid id, JsonPatchDocument<T> patch);
    Task<VoidOperationResult<AccessSingleEntityError>> DeleteAsync(Guid id);
    Task<OperationResult<SearchResult<T>, AccessMultipleEntitiesError>> SearchAsync(TSearchRequest? searchRequest = null);
}