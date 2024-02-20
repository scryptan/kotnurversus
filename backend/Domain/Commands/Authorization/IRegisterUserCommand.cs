using Models;
using Models.Authorization;

namespace Domain.Commands.Authorization;

public interface IRegisterUserCommand
{
    Task<DomainResult<User, AccessSingleEntityError>> RunAsync(UserRegisterRequest request);
}