using Domain.Commands;
using KotnurVersus.Web.Helpers;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Models;
using Models.Search;

namespace KotnurVersus.Web.Controllers.Base;

public abstract class CreatableEntityControllerBase<T, TCreationArgs, TInvalidDataReason, TSearchRequest> : EntityControllerBase<T, TInvalidDataReason, TSearchRequest>
    where T : EntityInfo, IEntity
    where TInvalidDataReason : struct, Enum
    where TCreationArgs : EntityCreationArgs
    where TSearchRequest : SearchRequestBase, ISearchRequest, new()
{
    [HttpPost]
    public async Task<ActionResult<T, CreateErrorInfo<CreateEntityError, TInvalidDataReason>>> Create(
        [FromServices] ICreateCommand<T, TCreationArgs, TInvalidDataReason> createCommand,
        [FromBody] TCreationArgs args)
    {
        var result = await createCommand.RunAsync(Guid.NewGuid(), args, HttpContext.RequestAborted);
        return result.ToActionResult();
    }

    [HttpPatch("{id:guid}")]
    public async Task<ActionResult<T, PatchErrorInfo<PatchEntityError, TInvalidDataReason>>> Patch(
        [FromServices] IPatchCommand<T, TInvalidDataReason> createCommand,
        [FromRoute] Guid id,
        [FromBody] JsonPatchDocument<T> patch)
    {
        var result = await createCommand.RunAsync(id, patch, HttpContext.RequestAborted);
        return result.ToActionResult();
    }
}