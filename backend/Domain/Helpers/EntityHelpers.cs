using Models;

namespace Domain.Helpers;

public static class EntityHelpers
{
    public static T CopyEntity<T>(this T entity, bool shallow = false)
        where T : IEntity
    {
        return (T)EntityCopier.Copy(entity, typeof(T), shallow)!;
    }
}