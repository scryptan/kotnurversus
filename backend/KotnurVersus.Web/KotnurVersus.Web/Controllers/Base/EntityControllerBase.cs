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
}