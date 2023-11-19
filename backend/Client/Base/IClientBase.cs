using Microsoft.AspNetCore.JsonPatch;
using Models;

namespace Client.Base;

public interface IClientBase<T, TCreationArgs, TInvalidDataReason>
    where TInvalidDataReason : struct, Enum
    // where TSearchRequest : class, ISearchRequest
    where TCreationArgs : EntityCreationArgs
    where T : class
{
    public Task<OperationResult<T, AccessSingleEntityError>> GetAsync(Guid id);
    public Task<OperationResult<T, TInvalidDataReason>> CreateAsync(TCreationArgs creationArgs);
    public Task<OperationResult<T, TInvalidDataReason>> PatchAsync(Guid id, JsonPatchDocument<T> patch);
    public Task<VoidOperationResult<AccessSingleEntityError>> DeleteAsync(Guid id);
}