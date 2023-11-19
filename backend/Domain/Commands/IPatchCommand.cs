using Microsoft.AspNetCore.JsonPatch;
using Models;

namespace Domain.Commands;

public interface IPatchCommand<T, TInvalidDataReason>
    where T : EntityInfo, IEntity
    where TInvalidDataReason : struct, Enum
{
    Task<DomainResult<T, PatchEntityError, PatchErrorInfo<PatchEntityError, TInvalidDataReason>>> RunAsync(
        Guid id,
        JsonPatchDocument<T> patch,
        CancellationToken cancellationToken);
}