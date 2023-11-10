using Domain.Context;
using Domain.Repositories.Base;
using Models;

namespace Domain.Commands.Base;

public abstract class DeleteCommandBase<T> : DeleteCommandBase<T, T>
    where T : EntityInfo, IEntity
{
    protected DeleteCommandBase(IDataContextAccessor dataContextAccessor, IEntityRepository<T> repository)
        : base(dataContextAccessor, repository)
    {
    }
}

public abstract class DeleteCommandBase<TEx, T> : IDeleteCommand<T>
    where TEx : T
    where T : EntityInfo, IEntity
{
    private readonly IDataContextAccessor dataContextAccessor;
    private readonly IEntityRepository<TEx> repository;

    protected DeleteCommandBase(
        IDataContextAccessor dataContextAccessor,
        IEntityRepository<TEx> repository)
    {
        this.dataContextAccessor = dataContextAccessor;
        this.repository = repository;
    }

    public async Task<VoidDomainResult<AccessSingleEntityError>> RunAsync(Guid id)
    {
        var result = await dataContextAccessor.AccessDataAsync<VoidDomainResult<AccessSingleEntityError>>(
            async dbContext =>
            {
                var existing = await repository.FindAsync(id);
                if (existing == null)
                    return VoidDomainResult.Success;

                if (await HasHangingDepsAsync(id))
                    return new ErrorInfo<AccessSingleEntityError>(AccessSingleEntityError.Forbidden, $"{typeof(T).Name} with id {id} has hanging dependencies");

                await repository.DeleteAsync(existing);
                await dbContext.SaveChangesAsync();
                return VoidDomainResult.Success;
            });

        await AfterDeleteAsync(id);
        return result;
    }

    protected virtual Task<bool> HasHangingDepsAsync(Guid id) => Task.FromResult(false);

    protected virtual Task AfterDeleteAsync(Guid id) => Task.CompletedTask;
}