using Core.Helpers;
using Db.Dbo.Users;
using Domain.Context;
using Domain.Helpers;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Authorization;

namespace Domain.Commands.Authorization;

public class RegisterUserCommand : IRegisterUserCommand
{
    private readonly IDataContextAccessor dataContextAccessor;

    public RegisterUserCommand(IDataContextAccessor dataContextAccessor)
    {
        this.dataContextAccessor = dataContextAccessor;
    }

    public async Task<DomainResult<User, AccessSingleEntityError>> RunAsync(UserRegisterRequest request)
    {
        var result = await dataContextAccessor.AccessDataAsync<DomainResult<User, AccessSingleEntityError>>(
            async dbContext =>
            {
                var existing = await dbContext.Users
                    .FirstOrDefaultAsync(x => x.Email == request.Email.ToLowerInvariant());
                if (existing != null)
                    return new ErrorInfo<AccessSingleEntityError>(AccessSingleEntityError.Forbidden, "User already exist");

                var passwordHash = SecretHasher.Hash(request.Password);

                var isAuthorized = !await dbContext.Users.AnyAsync();
                var user = new UserDbo
                {
                    Id = Guid.NewGuid(),
                    Email = request.Email.ToLowerInvariant(),
                    PasswordHash = passwordHash,
                    IsAuthorized = isAuthorized
                };

                dbContext.Users.Add(user);
                await dbContext.SaveChangesAsync();

                return user.ToApiModel();
            });

        return result;
    }
}