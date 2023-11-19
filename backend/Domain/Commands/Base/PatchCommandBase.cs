using Domain.Context;
using Domain.Services.Base;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.EntityFrameworkCore;
using Models;
using Npgsql;

namespace Domain.Commands.Base;

public abstract class PatchCommandBase<T, TInvalidDataReason> : IPatchCommand<T, TInvalidDataReason>
    where T : EntityInfo, IEntity
    where TInvalidDataReason : struct, Enum
{
    private readonly IDataContextAccessor dataContextAccessor;
    private readonly IEntityService<T> repository;

    protected PatchCommandBase(
        IDataContextAccessor dataContextAccessor,
        IEntityService<T> repository)
    {
        this.dataContextAccessor = dataContextAccessor;
        this.repository = repository;
    }

    public Task<DomainResult<T, PatchEntityError, PatchErrorInfo<PatchEntityError, TInvalidDataReason>>> RunAsync(
        Guid id,
        JsonPatchDocument<T> patch,
        CancellationToken cancellationToken)
    {
        return dataContextAccessor.AccessDataAsync<DomainResult<T, PatchEntityError, PatchErrorInfo<PatchEntityError, TInvalidDataReason>>>(
            async dbContext =>
            {
                var old = await repository.FindAsync(id);
                if (old == null)
                    return new PatchErrorInfo<PatchEntityError, TInvalidDataReason>(PatchEntityError.NotFound, $"{typeof(T).Name} {id} not found");

                await repository.PatchAsync(old, patch);

                try
                {
                    await dbContext.SaveChangesAsync(cancellationToken);
                }
                catch (DbUpdateException e) when (e.InnerException is PostgresException pe && pe.SqlState == "23505")
                {
                    if (string.IsNullOrEmpty(pe.ConstraintName))
                        throw;
                    var errorInfo = TryHandleConstraintViolation(pe.ConstraintName);
                    if (errorInfo == null)
                        throw;
                    return errorInfo;
                }

                var entity = await repository.FindAsync(id);

                return entity!;
            });
    }

    protected virtual PatchErrorInfo<PatchEntityError, TInvalidDataReason>? TryHandleConstraintViolation(string constraintName) => null;
}