using Models;

namespace Domain.Commands;

public interface IGetCommand<T>
    where T : EntityInfo, IEntity
{
    Task<DomainResult<T, AccessSingleEntityError>> RunAsync(Guid id);
}