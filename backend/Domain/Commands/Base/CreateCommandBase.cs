using Domain.Context;
using Domain.Helpers;
using Domain.Services;
using Domain.Services.Base;
using Microsoft.EntityFrameworkCore;
using Models;
using Npgsql;

namespace Domain.Commands.Base;

public abstract class CreateCommandBase<T, TCreationArgs, TInvalidDataReason> : CreateCommandBase<T, T, TCreationArgs, TInvalidDataReason>
    where TCreationArgs : EntityCreationArgs
    where T : EntityInfo, IEntity
    where TInvalidDataReason : struct, Enum
{
    protected CreateCommandBase(
        IDataContextAccessor dataContextAccessor,
        IEntityService<T, TInvalidDataReason> repository)
        : base(dataContextAccessor, repository)
    {
    }
}

public abstract class CreateCommandBase<TEx, T, TCreationArgs, TInvalidDataReason> : ICreateCommand<T, TCreationArgs, TInvalidDataReason>
    where TCreationArgs : EntityCreationArgs
    where TEx : T
    where T : EntityInfo, IEntity
    where TInvalidDataReason : struct, Enum
{
    private readonly IDataContextAccessor dataContextAccessor;
    private readonly IEntityService<TEx, TInvalidDataReason> repository;

    protected CreateCommandBase(
        IDataContextAccessor dataContextAccessor,
        IEntityService<TEx, TInvalidDataReason> repository)
    {
        this.dataContextAccessor = dataContextAccessor;
        this.repository = repository;
    }

    public Task<DomainResult<T, CreateEntityError, CreateErrorInfo<CreateEntityError, TInvalidDataReason>>> RunAsync(
        Guid id,
        TCreationArgs args,
        CancellationToken cancellationToken)
    {
        return dataContextAccessor.AccessDataAsync<DomainResult<T, CreateEntityError, CreateErrorInfo<CreateEntityError, TInvalidDataReason>>>(
            async dbContext =>
            {
                var existing = await repository.FindAsync(id);
                if (existing != null)
                {
                    return typeof(T) == typeof(TEx)
                        ? existing
                        : existing.CopyEntity<T>(shallow: true);
                }

                var entity = await ConvertToEntityAsync(args);
                entity.Id = id;

                var writeContext = new WriteContext<TEx, TInvalidDataReason>();
                await repository.WriteAsync(entity, writeContext);
                if (writeContext.IsSuccess)
                {
                    try
                    {
                        await dbContext.SaveChangesAsync(cancellationToken);
                    }
                    catch (DbUpdateException e) when (e.InnerException is PostgresException pe && pe.SqlState == "23505")
                    {
                        if (string.IsNullOrEmpty(pe.ConstraintName))
                            throw;
                        var errorInfo = TryHandleConstraintViolation(pe.ConstraintName, entity);
                        if (errorInfo == null)
                            throw;
                        return errorInfo;
                    }

                    return typeof(T) == typeof(TEx)
                        ? entity
                        : entity.CopyEntity<T>(shallow: true);
                }

                if (writeContext.IsEntityTooLarge)
                    return new CreateErrorInfo<CreateEntityError, TInvalidDataReason>(CreateEntityError.EntityTooLarge, $"Couldn't create {typeof(T).Name} with specified arguments");

                if (writeContext.IsForbidden)
                    return new CreateErrorInfo<CreateEntityError, TInvalidDataReason>(CreateEntityError.Forbidden, $"User has no rights to create {typeof(T).Name} with specified arguments");

                return new CreateErrorInfo<CreateEntityError, TInvalidDataReason>(CreateEntityError.InvalidData, $"Couldn't create {typeof(T).Name} with specified arguments")
                {
                    InvalidDatas = writeContext.InvalidDatas,
                };
            });
    }

    protected virtual CreateErrorInfo<CreateEntityError, TInvalidDataReason>? TryHandleConstraintViolation(string constraintName, T entity) => null;

    protected virtual TEx ConvertToEntity(TCreationArgs args) => throw new NotSupportedException();

    protected virtual Task<TEx> ConvertToEntityAsync(TCreationArgs args) => Task.FromResult(ConvertToEntity(args));
}