using Models;

namespace Domain.Commands;

public interface ICreateCommand<T, in TCreationArgs, TInvalidDataReason>
    where TCreationArgs : EntityCreationArgs
    where T : EntityInfo, IEntity
    where TInvalidDataReason : struct, Enum
{
    Task<DomainResult<T, CreateEntityError, CreateErrorInfo<CreateEntityError, TInvalidDataReason>>> RunAsync(
        Guid id,
        TCreationArgs args,
        CancellationToken cancellationToken);
}