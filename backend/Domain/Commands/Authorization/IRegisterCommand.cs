using Models;
using Models.Authorization;

namespace Domain.Commands.Authorization;

public interface IRegisterCommand
{
    Task<DomainResult<User, AccessSingleEntityError>> RunAsync(UserRegisterRequest request);
}