using Core.Helpers;
using Domain.Context;
using Domain.Helpers;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Authorization;

namespace Domain.Commands.Authorization;

internal class LoginCommand : ILoginCommand
{
    private readonly IDataContextAccessor dataContextAccessor;

    public LoginCommand(IDataContextAccessor dataContextAccessor)
    {
        this.dataContextAccessor = dataContextAccessor;
    }

    public async Task<DomainResult<User, AccessSingleEntityError>> RunAsync(UserLoginRequest request)
    {
        var result = await dataContextAccessor.AccessDataAsync<DomainResult<User, AccessSingleEntityError>>(
            async dbContext =>
            {
                var passwordHash = SecretHasher.Hash(request.Password);
                var existing = await dbContext.Users
                    .FirstOrDefaultAsync(x => x.Email == request.Email.ToLowerInvariant() && x.PasswordHash == passwordHash);
                if (existing == null)
                    return new ErrorInfo<AccessSingleEntityError>(AccessSingleEntityError.NotFound, "User not found");

                return existing.ToApiModel();
            });

        return result;
    }
}