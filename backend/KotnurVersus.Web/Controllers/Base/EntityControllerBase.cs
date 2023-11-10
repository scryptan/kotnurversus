using Domain.Commands;
using KotnurVersus.Web.Helpers;
using Microsoft.AspNetCore.Mvc;
using Models;

namespace KotnurVersus.Web.Controllers.Base;

public abstract class EntityControllerBase<T, TInvalidDataReason, TSearchRequest> : ApiControllerBase
    where T : EntityInfo, IEntity
    where TInvalidDataReason : struct, Enum
    where TSearchRequest : class
{
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<T, ErrorInfo<AccessSingleEntityError>>> Get([FromServices] IGetCommand<T> command, Guid id)
    {
        var result = await command.RunAsync(id);
        return result.ToActionResult();
    }

    [HttpDelete("{id:guid}")]
    public async Task<VoidActionResult<ErrorInfo<AccessSingleEntityError>>> Delete([FromServices] IDeleteCommand<T> command, Guid id)
    {
        var result = await command.RunAsync(id);
        return result.ToActionResult();
    }

    // [HttpGet]
    // public async Task<ActionResult<SearchResult<T>, ErrorInfo<AccessMultipleEntitiesError>>> Search([FromQuery] BatchGetRequest? batchGetRequest = null, [FromQuery] TSearchRequest? searchRequest = null)
    // {
    //     var result = await searchCommand.RunAsync(batchGetRequest, searchRequest, HttpContext.RequestAborted, GetTransientAccessToken());
    //     return result.ToActionResult();
    // }
    //
    // [HttpPatch("{id:guid}")]
    // public async virtual Task<ActionResult<T, PatchErrorInfo<PatchEntityError, TInvalidDataReason>>> Patch(Guid id, [FromBody] Patch<T> patch, [FromQuery] bool skipUserConstraints = false)
    // {
    //     var result = await patchCommand.RunAsync(id, patch, options, HttpContext.RequestAborted);
    //     return result.ToActionResult();
    // }
}