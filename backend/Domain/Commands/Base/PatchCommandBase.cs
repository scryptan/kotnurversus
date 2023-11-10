// using Domain.Context;
// using Domain.Services;
// using Microsoft.EntityFrameworkCore;
// using Models;
// using Npgsql;
//
// namespace Domain.Commands.Base;
//
// public abstract class PatchCommandBase<T, TInvalidDataReason> : PatchCommandBase<T, T, TInvalidDataReason>
//     where T : EntityInfo, IEntity
//     where TInvalidDataReason : struct, Enum
// {
//     protected PatchCommandBase(
//         IDataContextAccessor dataContextAccessor,
//         IEntityRepository<T, TInvalidDataReason> repository,
//         Patcher<T> patcher,
//         IAccessChecker<T> accessChecker)
//         : base(dataContextAccessor, repository, patcher, accessChecker)
//     {
//     }
// }
//
// public abstract class PatchCommandBase<TEx, T, TInvalidDataReason> : IPatchCommand<T, TInvalidDataReason>
//     where TEx : T
//     where T : EntityInfo, IEntity
//     where TInvalidDataReason : struct, Enum
// {
//     private readonly IDataContextAccessor dataContextAccessor;
//     private readonly IEntityRepository<TEx, TInvalidDataReason> repository;
//     private readonly Patcher<T> patcher;
//     private readonly IAccessChecker<TEx> accessChecker;
//
//     protected PatchCommandBase(
//         IDataContextAccessor dataContextAccessor,
//         IEntityRepository<TEx, TInvalidDataReason> repository,
//         Patcher<T> patcher,
//         IAccessChecker<TEx> accessChecker)
//     {
//         this.dataContextAccessor = dataContextAccessor;
//         this.repository = repository;
//         this.patcher = patcher;
//         this.accessChecker = accessChecker;
//     }
//
//     public Task<DomainResult<T, PatchEntityError, PatchErrorInfo<PatchEntityError, TInvalidDataReason>>> RunAsync(
//         Guid id,
//         Patch<T> patch,
//         ProcessOptions options,
//         CancellationToken cancellationToken)
//     {
//         return dataContextAccessor.AccessDataAsync<DomainResult<T, PatchEntityError, PatchErrorInfo<PatchEntityError, TInvalidDataReason>>>(
//             async dbContext =>
//             {
//                 var canWrite = accessChecker.CanUpdate();
//                 if (canWrite == false)
//                     return new PatchErrorInfo<PatchEntityError, TInvalidDataReason>(PatchEntityError.Forbidden, $"Write access to {typeof(T).Name} is denied");
//
//                 var old = await repository.FindAsync(id);
//                 if (old == null)
//                     return new PatchErrorInfo<PatchEntityError, TInvalidDataReason>(PatchEntityError.NotFound, $"{typeof(T).Name} {id} not found");
//
//                 if (canWrite != true)
//                 {
//                     if (!accessChecker.CanUpdate(old))
//                         return new PatchErrorInfo<PatchEntityError, TInvalidDataReason>(PatchEntityError.Forbidden, $"Write access to {typeof(T).Name} with id {id} is denied");
//                 }
//
//                 var patched = old.CopyEntity();
//                 var patchResult = patcher.Patch(patched, patch);
//                 if (!patchResult.Success)
//                 {
//                     return new PatchErrorInfo<PatchEntityError, TInvalidDataReason>(PatchEntityError.InvalidArgs, "Patch contains invalid operations")
//                     {
//                         InvalidPaths = patchResult.InvalidPaths,
//                         InvalidValueTypes = patchResult.InvalidValueTypes
//                     };
//                 }
//
//                 var havePermissionToPatch = await accessChecker.UsersCanUpdate(old, patched, cancellationToken);
//                 if (havePermissionToPatch == false)
//                     return new PatchErrorInfo<PatchEntityError, TInvalidDataReason>(PatchEntityError.Forbidden, $"Write access to {typeof(T).Name} with id {id} is denied");
//
//                 if (canWrite != true)
//                 {
//                     if (!await accessChecker.CanUpdateAsync(old, patched))
//                         return new PatchErrorInfo<PatchEntityError, TInvalidDataReason>(PatchEntityError.Forbidden, $"Write access to patched {typeof(T).Name} with id {id} is lost");
//                 }
//
//                 var writeContext = new WriteContext<TEx, TInvalidDataReason>();
//                 await repository.WriteAsync(patched, writeContext, options);
//                 if (writeContext.IsSuccess)
//                 {
//                     try
//                     {
//                         await dbContext.SaveChangesAsync();
//                     }
//                     catch (DbUpdateException e) when (e.InnerException is PostgresException pe && pe.SqlState == "23505")
//                     {
//                         if (string.IsNullOrEmpty(pe.ConstraintName))
//                             throw;
//                         var errorInfo = TryHandleConstraintViolation(pe.ConstraintName, patched);
//                         if (errorInfo == null)
//                             throw;
//                         return errorInfo;
//                     }
//
//                     return typeof(T) == typeof(TEx)
//                         ? patched
//                         : patched.CopyEntity<T>(shallow: true);
//                 }
//
//                 if (writeContext.IsEntityTooLarge)
//                     return new PatchErrorInfo<PatchEntityError, TInvalidDataReason>(PatchEntityError.EntityTooLarge, "Patch produced invalid data");
//
//                 if (writeContext.IsForbidden)
//                     return new PatchErrorInfo<PatchEntityError, TInvalidDataReason>(PatchEntityError.Forbidden, "User has no rights to apply this patch");
//
//                 return new PatchErrorInfo<PatchEntityError, TInvalidDataReason>(PatchEntityError.InvalidData, "Patch produced invalid data")
//                 {
//                     InvalidDatas = writeContext.InvalidDatas,
//                     InvalidConstraints = writeContext.InvalidConstraints,
//                 };
//             });
//     }
//
//     protected virtual PatchErrorInfo<PatchEntityError, TInvalidDataReason>? TryHandleConstraintViolation(string constraintName, T entity) => null;
//     public virtual Task<T> ClearSensitiveDataAsync(T entity) => Task.FromResult(entity);
// }