// using Domain.Context;
// using Models;
//
// namespace Domain.Commands.Base;
//
// public abstract class SearchCommandBase<T, TInvalidDataReason, TSearchRequest> : SearchCommandBase<T, T, TInvalidDataReason, TSearchRequest>
//     where T : EntityInfo, IEntity
//     where TInvalidDataReason : struct, Enum
//     where TSearchRequest : class, ISearchRequest, new()
// {
//     protected SearchCommandBase(
//         IEntityRepository<T, TInvalidDataReason, TSearchRequest> repository,
//         IDataContextAccessor dataContextAccessor,
//         IAccessChecker<T, TSearchRequest> accessChecker)
//         : base(repository, dataContextAccessor, accessChecker)
//     {
//     }
// }
//
// public abstract class SearchCommandBase<TEx, T, TInvalidDataReason, TSearchRequest> : ISearchCommand<T, TSearchRequest>
//     where TEx : T
//     where T : EntityInfo, IEntity
//     where TInvalidDataReason : struct, Enum
//     where TSearchRequest : class, ISearchRequest, new()
// {
//     private readonly IEntityRepository<TEx, TInvalidDataReason, TSearchRequest> repository;
//     private readonly IDataContextAccessor dataContextAccessor;
//     private readonly IAccessChecker<TEx, TSearchRequest> accessChecker;
//
//     protected SearchCommandBase(
//         IEntityRepository<TEx, TInvalidDataReason, TSearchRequest> repository,
//         IDataContextAccessor dataContextAccessor,
//         IAccessChecker<TEx, TSearchRequest> accessChecker)
//     {
//         this.repository = repository;
//         this.dataContextAccessor = dataContextAccessor;
//         this.accessChecker = accessChecker;
//     }
//
//     public Task<DomainResult<CountResult, CountError>> CountAsync(TSearchRequest? searchRequest, CancellationToken cancellationToken,
//                                                                   TransientAccessToken? transientAccessToken)
//     {
//         return dataContextAccessor.AccessDataAsync<DomainResult<CountResult, CountError>>(
//             async _ =>
//             {
//                 if (accessChecker.CanRead() == false)
//                     return new ErrorInfo<CountError>(CountError.Forbidden, $"Read access to {typeof(T)} is denied");
//
//                 searchRequest ??= new TSearchRequest();
//
//                 var searchRequestValidationResult = await repository.ValidateSearchRequestAsync(searchRequest);
//                 switch (searchRequestValidationResult.Status)
//                 {
//                     case SearchRequestValidationStatus.InvalidSort:
//                         return new ErrorInfo<CountError>(CountError.InvalidSort, searchRequestValidationResult.ErrorMessage!);
//
//                     case SearchRequestValidationStatus.InvalidOffset:
//                         return new ErrorInfo<CountError>(CountError.InvalidOffset, searchRequestValidationResult.ErrorMessage!);
//
//                     case SearchRequestValidationStatus.Success:
//                         if (!await accessChecker.TryApplyToSearchRequest(searchRequest, transientAccessToken))
//                             return new CountResult(0, false);
//
//                         return await repository.CountAsync(searchRequest, cancellationToken);
//
//                     default:
//                         throw new InvalidOperationException($"Unknown {nameof(SearchRequestValidationStatus)}: {searchRequestValidationResult.Status}");
//                 }
//             });
//     }
//
//     public Task<DomainResult<SearchResult<T>, AccessMultipleEntitiesError>> RunAsync(
//         BatchGetRequest? batchGetRequest,
//         TSearchRequest? searchRequest,
//         CancellationToken cancellationToken,
//         TransientAccessToken? transientAccessToken = null)
//     {
//         return dataContextAccessor.AccessDataAsync(
//             async _ =>
//             {
//                 if (batchGetRequest?.Id?.Values.Any() == true)
//                     return await BatchGetAsync(batchGetRequest, cancellationToken, transientAccessToken);
//
//                 return await SearchAsync(searchRequest, transientAccessToken, cancellationToken);
//             });
//     }
//
//     private async Task<DomainResult<SearchResult<T>, AccessMultipleEntitiesError>> SearchAsync(
//         TSearchRequest? searchRequest,
//         TransientAccessToken? transientAccessToken,
//         CancellationToken cancellationToken)
//     {
//         var canRead = accessChecker.CanRead();
//         if (canRead == false)
//             return new ErrorInfo<AccessMultipleEntitiesError>(AccessMultipleEntitiesError.Forbidden, $"Read access to {typeof(T)} is denied");
//
//         searchRequest ??= new TSearchRequest();
//
//         var searchRequestValidationResult = await repository.ValidateSearchRequestAsync(searchRequest);
//         switch (searchRequestValidationResult.Status)
//         {
//             case SearchRequestValidationStatus.InvalidSort:
//                 return new ErrorInfo<AccessMultipleEntitiesError>(AccessMultipleEntitiesError.InvalidSort, searchRequestValidationResult.ErrorMessage!);
//
//             case SearchRequestValidationStatus.InvalidOffset:
//                 return new ErrorInfo<AccessMultipleEntitiesError>(AccessMultipleEntitiesError.InvalidOffset, searchRequestValidationResult.ErrorMessage!);
//
//             case SearchRequestValidationStatus.Success:
//                 if (!await accessChecker.TryApplyToSearchRequest(searchRequest, transientAccessToken))
//                     return new SearchResult<T>();
//
//                 var result = await repository.SearchAsync(searchRequest, asNoTracking: true, cancellationToken);
//                 return typeof(T) == typeof(TEx)
//                     ? result as SearchResult<T> ?? throw new InvalidOperationException()
//                     : new SearchResult<T>(result.Items.Select(x => x.CopyEntity<T>(shallow: true)).ToArray(), result.FirstOffset, result.LastOffset, result.HasMore);
//
//             default:
//                 throw new InvalidOperationException($"Unknown {nameof(SearchRequestValidationStatus)}: {searchRequestValidationResult.Status}");
//         }
//     }
//
//     private async Task<DomainResult<SearchResult<T>, AccessMultipleEntitiesError>> BatchGetAsync(
//         BatchGetRequest batchGetRequest,
//         CancellationToken cancellationToken,
//         TransientAccessToken? transientAccessToken)
//     {
//         var canRead = accessChecker.CanRead();
//         if (canRead == false)
//             return new ErrorInfo<AccessMultipleEntitiesError>(AccessMultipleEntitiesError.Forbidden, $"Read access to {typeof(T)} is denied");
//
//         var itemsEx = (await repository.BatchGetAsync(batchGetRequest, asNoTracking: true, cancellationToken)).Items;
//
//         var items = new List<T>(itemsEx.Length);
//         foreach (var ex in itemsEx)
//         {
//             if (!(canRead == true || await accessChecker.CanReadAsync(ex, transientAccessToken)))
//                 continue;
//             items.Add(typeof(T) == typeof(TEx) ? ex : ex.CopyEntity<T>(shallow: true));
//         }
//
//         return new SearchResult<T>(items.ToArray(), null, null, false);
//     }
// }