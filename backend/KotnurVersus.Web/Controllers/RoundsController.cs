using Domain.Commands.Rounds;
using KotnurVersus.Web.Controllers.Base;
using KotnurVersus.Web.Helpers;
using Microsoft.AspNetCore.Mvc;
using Models;
using Models.Rounds;

namespace KotnurVersus.Web.Controllers;

public class RoundsController : CreatableEntityControllerBase<Round, RoundCreationArgs, InvalidRoundDataReason, RoundSearchRequest>
{
    [HttpPost("{id:guid}/init")]
    public async Task<ActionResult<Round, ErrorInfo<InvalidRoundDataReason>>> InitRound(
        [FromServices] IStartRoundCommand command,
        [FromRoute] Guid id)
    {
        var result = await command.RunAsync(id);
        return result.ToActionResult();
    }

    [HttpPost("{id:guid}/finish")]
    public async Task<ActionResult<Round, ErrorInfo<InvalidRoundDataReason>>> FinishRound(
        [FromServices] IFinishRoundCommand command,
        [FromRoute] Guid id,
        [FromBody] FinishRoundRequest request)
    {
        var result = await command.RunAsync(id, request.Marks);
        return result.ToActionResult();
    }

    [HttpPost("{id:guid}/start/{state}")]
    public async Task<ActionResult<Round, ErrorInfo<InvalidRoundDataReason>>> StartRoundState(
        [FromServices] IProcessRoundCommand command,
        [FromRoute] Guid id,
        [FromRoute] RoundState state,
        [FromQuery] Guid? teamId)
    {
        var result = await command.RunAsync(id, state, teamId, true);
        return result.ToActionResult();
    }

    [HttpPost("{id:guid}/end/{state}")]
    public async Task<ActionResult<Round, ErrorInfo<InvalidRoundDataReason>>> EndRoundState(
        [FromServices] IProcessRoundCommand command,
        [FromRoute] Guid id,
        [FromRoute] RoundState state,
        [FromQuery] Guid? teamId)
    {
        var result = await command.RunAsync(id, state, teamId, false);
        return result.ToActionResult();
    }
}