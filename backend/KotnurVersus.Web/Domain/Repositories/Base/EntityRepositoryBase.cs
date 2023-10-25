using Db.Dbo;
using Microsoft.EntityFrameworkCore;
using Models;
using DbContext = Db.DbContext;

namespace Domain.Repositories.Base;

public class EntityRepositoryBase<T, TDbo> : IEntityRepository<T>
    where T : EntityInfo, IEntity, new()
    where TDbo : Dbo, new()
{
    
    private readonly Func<DbContext, DbSet<TDbo>> getMainDbSet;

    public EntityRepositoryBase(Func<DbContext, DbSet<TDbo>> getMainDbSet)
    {
        this.getMainDbSet = getMainDbSet;
    }


    public Task<T?> FindAsync(Guid id)
    {
        throw new NotImplementedException();
    }

    public Task WriteAsync(T entity, bool isRestore)
    {
        throw new NotImplementedException();
    }

    public Task DeleteAsync(T entity)
    {
        throw new NotImplementedException();
    }
    
    protected IQueryable<TDbo> QueryDbo(Guid id)
    {
        return getMainDbSet(Context.DbContext).Where(x => x.Id == id);
    }

    protected IQueryable<TDbo> QueryDbos()
    {
        return getMainDbSet(Context.DbContext).AsQueryable();
    }

}