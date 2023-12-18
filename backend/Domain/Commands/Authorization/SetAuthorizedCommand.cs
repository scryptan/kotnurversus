using Domain.Context;
using Domain.Helpers;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Authorization;

namespace Domain.Commands.Authorization;

public class SetAuthorizedCommand : ISetAuthorizedCommand
{
    private readonly IDataContextAccessor dataContextAccessor;

    public SetAuthorizedCommand(IDataContextAccessor dataContextAccessor)
    {
        this.dataContextAccessor = dataContextAccessor;
    }

    public async Task<DomainResult<User, AccessSingleEntityError>> RunAsync(Guid id, bool isAuthorized)
    {
        var result = await dataContextAccessor.AccessDataAsync<DomainResult<User, AccessSingleEntityError>>(
            async dbContext =>
            {
                var existing = await dbContext.Users
                    .FirstOrDefaultAsync(x => x.Id == id);
                if (existing == null)
                    return new ErrorInfo<AccessSingleEntityError>(AccessSingleEntityError.NotFound, "User not found");

                existing.IsAuthorized = isAuthorized;
                dbContext.Users.Update(existing);
                await dbContext.SaveChangesAsync();

                return existing.ToApiModel();
            });

        return result;
    }
}