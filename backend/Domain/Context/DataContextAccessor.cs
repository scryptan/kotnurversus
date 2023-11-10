using Db;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Vostok.Logging.Abstractions;
using DbContext = Db.DbContext;
using Core.Helpers;

namespace Domain.Context;

public class DataContextAccessor : IDataContextAccessor
{
    private const int concurrentCallsTryCount = 10;
    private readonly IDbContextFactory dbContextFactory;
    private readonly ILog log;

    public DataContextAccessor(
        IDbContextFactory dbContextFactory,
        ILog log)
    {
        this.dbContextFactory = dbContextFactory;
        this.log = log.ForContext(this);
    }

    public async Task<T> AccessDataAsync<T>(Func<DbContext, Task<T>> writeDataAsync, string[]? concurrentConstrains = null)
    {
        for (var i = 0; i < concurrentCallsTryCount; i++)
        {
            try
            {
                return await RunInContext(writeDataAsync);
            }
            catch (DbUpdateConcurrencyException e)
            {
                log.Warn(e, "Concurrent call occured");
            }
            catch (DbUpdateException e) when (e.InnerException is PostgresException pe
                                              && pe.SqlState == "23505"
                                              && (pe.ConstraintName?.StartsWith("PK_") == true
                                                  || pe.TableName?.EndsWith("_links") == true
                                                  || concurrentConstrains?.Contains(pe.ConstraintName) == true))
            {
                log.Warn(e, "Concurrent call occured");
            }
            catch (Exception e) when ((e as PostgresException ?? e.InnerException as PostgresException)?.SqlState == "57014")
            {
                var pe = (e as PostgresException ?? e.InnerException as PostgresException)!;
                log.Debug($"Canceled pg query: {pe.MessageText} {pe.Detail} {pe.InternalQuery}");
                throw new OperationCanceledException();
            }
        }

        throw new InvalidOperationException("Couldn't write data due to many concurrent calls");
    }

    private async Task<T> RunInContext<T>(Func<DbContext, Task<T>> runAsync)
    {
        T result;
        await using (var dbContext = dbContextFactory.CreateDbContext())
        using (ContextHolder.ChangeContext(
                   x =>
                   {
                       // ReSharper disable once AccessToDisposedClosure
                       x.DbContext = dbContext;
                       x.Now = DbContextHelpers.Now();
                       x.Cache = new Dictionary<object, object?>();
                   }))
        {
            result = await runAsync(dbContext);
        }

        return result;
    }
}