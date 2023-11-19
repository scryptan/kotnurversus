using Domain.Context;
using Domain.Services.Base;
using Models;

namespace Domain.Commands.Base;

public abstract class DeleteCommandBase<T> : IDeleteCommand<T>
    where T : EntityInfo, IEntity
{
    private readonly IDataContextAccessor dataContextAccessor;
    private readonly IEntityService<T> service;

    protected DeleteCommandBase(
        IDataContextAccessor dataContextAccessor,
        IEntityService<T> service)
    {
        this.dataContextAccessor = dataContextAccessor;
        this.service = service;
    }

    public async Task<VoidDomainResult<AccessSingleEntityError>> RunAsync(Guid id)
    {
        var result = await dataContextAccessor.AccessDataAsync<VoidDomainResult<AccessSingleEntityError>>(
            async dbContext =>
            {
                var existing = await service.FindAsync(id);
                if (existing == null)
                    return VoidDomainResult.Success;

                if (await HasHangingDepsAsync(id))
                    return new ErrorInfo<AccessSingleEntityError>(AccessSingleEntityError.Forbidden, $"{typeof(T).Name} with id {id} has hanging dependencies");

                await service.DeleteAsync(existing);
                await dbContext.SaveChangesAsync();
                return VoidDomainResult.Success;
            });

        await AfterDeleteAsync(id);
        return result;
    }

    protected virtual Task<bool> HasHangingDepsAsync(Guid id) => Task.FromResult(false);

    protected virtual Task AfterDeleteAsync(Guid id) => Task.CompletedTask;
}