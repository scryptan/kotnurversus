using Models;
using Models.Search;

namespace Domain.Commands;

public interface ISearchCommand<T, TSearchRequest>
    where T : EntityInfo, IEntity
    where TSearchRequest : class, ISearchRequest, new()
{
    
}