using Domain.Context;
using Domain.Services.Base;
using Models;
using Models.Search;

namespace Domain.Commands.Base;

public abstract class SearchCommandBase<T, TSearchRequest> : ISearchCommand<T, TSearchRequest>
    where T : EntityInfo, IEntity
    where TSearchRequest : SearchRequestBase, ISearchRequest, new()
{
    private readonly IEntityService<T, TSearchRequest> service;
    private readonly IDataContextAccessor dataContextAccessor;

    protected SearchCommandBase(
        IEntityService<T, TSearchRequest> service,
        IDataContextAccessor dataContextAccessor)
    {
        this.service = service;
        this.dataContextAccessor = dataContextAccessor;
    }

    public Task<DomainResult<SearchResult<T>, AccessMultipleEntitiesError>> RunAsync(
        TSearchRequest? searchRequest,
        CancellationToken cancellationToken)
    {
        return dataContextAccessor.AccessDataAsync(
            async _ => await SearchAsync(searchRequest, cancellationToken));
    }

    private async Task<DomainResult<SearchResult<T>, AccessMultipleEntitiesError>> SearchAsync(
        TSearchRequest? searchRequest,
        CancellationToken cancellationToken)
    {
        searchRequest ??= new TSearchRequest();

        var result = await service.SearchAsync(searchRequest, cancellationToken);
        return result;
    }
}