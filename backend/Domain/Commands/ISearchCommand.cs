using Models;
using Models.Search;

namespace Domain.Commands;

public interface ISearchCommand<T, in TSearchRequest>
    where T : EntityInfo, IEntity
    where TSearchRequest : SearchRequestBase, ISearchRequest, new()
{
    public Task<DomainResult<SearchResult<T>, AccessMultipleEntitiesError>> RunAsync(
        TSearchRequest? searchRequest,
        CancellationToken cancellationToken);
}