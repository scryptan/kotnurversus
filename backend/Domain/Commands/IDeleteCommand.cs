using Models;

namespace Domain.Commands;

public interface IDeleteCommand<T>
{
    Task<VoidDomainResult<AccessSingleEntityError>> RunAsync(Guid id);
}