using Domain.Context;
using Domain.Helpers;
using Microsoft.EntityFrameworkCore;
using Models;
using Models.Authorization;

namespace Domain.Commands.Authorization;

public class GetUsersCommand : IGetUsersCommand
{
    private readonly IDataContextAccessor dataContextAccessor;

    public GetUsersCommand(IDataContextAccessor dataContextAccessor)
    {
        this.dataContextAccessor = dataContextAccessor;
    }

    public async Task<DomainResult<IEnumerable<User>, AccessMultipleEntitiesError>> RunAsync()
    {
        var result = await dataContextAccessor.AccessDataAsync<DomainResult<IEnumerable<User>, AccessMultipleEntitiesError>>(
            async dbContext =>
            {
                var users = await dbContext.Users.Select(x => x.ToApiModel()).ToListAsync();
                return users;
            });

        return result;
    }
}