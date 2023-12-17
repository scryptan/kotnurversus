using Models;
using Models.Authorization;

namespace Domain.Commands.Authorization;

public interface ISetAuthorizedCommand
{
    Task<DomainResult<User, AccessSingleEntityError>> RunAsync(Guid id, bool isAuthorized);
}