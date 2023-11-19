using Domain.Context;
using Domain.Services.Base;
using Microsoft.EntityFrameworkCore;
using Models;
using Npgsql;

namespace Domain.Commands.Base;

public abstract class CreateCommandBase<T, TCreationArgs, TInvalidDataReason> : ICreateCommand<T, TCreationArgs, TInvalidDataReason>
    where TCreationArgs : EntityCreationArgs
    where T : EntityInfo, IEntity
    where TInvalidDataReason : struct, Enum
{
    private readonly IDataContextAccessor dataContextAccessor;
    private readonly IEntityService<T> service;

    protected CreateCommandBase(
        IDataContextAccessor dataContextAccessor,
        IEntityService<T> service)
    {
        this.dataContextAccessor = dataContextAccessor;
        this.service = service;
    }

    public Task<DomainResult<T, CreateEntityError, CreateErrorInfo<CreateEntityError, TInvalidDataReason>>> RunAsync(
        Guid id,
        TCreationArgs args,
        CancellationToken cancellationToken)
    {
        return dataContextAccessor.AccessDataAsync<DomainResult<T, CreateEntityError, CreateErrorInfo<CreateEntityError, TInvalidDataReason>>>(
            async dbContext =>
            {
                var existing = await service.FindAsync(id);
                if (existing != null)
                {
                    return existing;
                }

                var entity = await ConvertToEntityAsync(args);
                entity.Id = id;

                await service.AddAsync(entity);
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

                return entity;
            });
    }

    protected virtual T ConvertToEntity(TCreationArgs args) => throw new NotSupportedException();

    protected virtual Task<T> ConvertToEntityAsync(TCreationArgs args) => Task.FromResult(ConvertToEntity(args));
    protected virtual CreateErrorInfo<CreateEntityError, TInvalidDataReason>? TryHandleConstraintViolation(string constraintName, T entity) => null;
}