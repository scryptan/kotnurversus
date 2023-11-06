using Domain.Commands;
using KotnurVersus.Web.Helpers;
using Microsoft.AspNetCore.Mvc;
using Models;

namespace KotnurVersus.Web.Controllers.Base;

public abstract class CreatableEntityControllerBase<T, TCreationArgs, TInvalidDataReason, TSearchRequest> : EntityControllerBase<T, TInvalidDataReason, TSearchRequest>
    where T : EntityInfo, IEntity
    where TInvalidDataReason : struct, Enum
    where TCreationArgs : EntityCreationArgs
    where TSearchRequest : class
{
    [HttpPost]
    public async Task<ActionResult<T, CreateErrorInfo<CreateEntityError, TInvalidDataReason>>> Create(
        [FromServices] ICreateCommand<T, TCreationArgs, TInvalidDataReason> createCommand,
        [FromBody] TCreationArgs args)
    {
        var result = await createCommand.RunAsync(Guid.NewGuid(), args, HttpContext.RequestAborted);
        return result.ToActionResult();
    }
}