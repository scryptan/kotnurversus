using Domain.Commands;
using KotnurVersus.Web.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models;
using Models.Search;

namespace KotnurVersus.Web.Controllers.Base;

public abstract class EntityControllerBase<T, TInvalidDataReason, TSearchRequest> : ApiControllerBase
    where T : EntityInfo, IEntity
    where TInvalidDataReason : struct, Enum
    where TSearchRequest : SearchRequestBase, ISearchRequest, new()
{
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<T, ErrorInfo<AccessSingleEntityError>>> Get([FromServices] IGetCommand<T> command, Guid id)
    {
        var result = await command.RunAsync(id);
        return result.ToActionResult();
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<VoidActionResult<ErrorInfo<AccessSingleEntityError>>> Delete([FromServices] IDeleteCommand<T> command, Guid id)
    {
        var result = await command.RunAsync(id);
        return result.ToActionResult();
    }

    [HttpGet]
    public async Task<ActionResult<SearchResult<T>, ErrorInfo<AccessMultipleEntitiesError>>> Search(
        [FromServices] ISearchCommand<T, TSearchRequest> command,
        [FromQuery] TSearchRequest? searchRequest = null)
    {
        var result = await command.RunAsync(searchRequest, HttpContext.RequestAborted);
        return result.ToActionResult();
    }
}