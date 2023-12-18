using Models;
using Models.Authorization;

namespace Domain.Commands.Authorization;

public interface IGetUsersCommand
{
    Task<DomainResult<IEnumerable<User>, AccessMultipleEntitiesError>> RunAsync();
}