using Models;
using Models.Authorization;

namespace Domain.Commands.Authorization;

public interface ILoginCommand
{
    Task<DomainResult<User, AccessSingleEntityError>> RunAsync(UserLoginRequest request);
}