using Domain.Commands.Games;
using KotnurVersus.Web.Controllers.Base;
using KotnurVersus.Web.Helpers;
using Microsoft.AspNetCore.Mvc;
using Models;
using Models.Games;

namespace KotnurVersus.Web.Controllers;

public class GamesController : CreatableEntityControllerBase<Game, GameCreationArgs, InvalidGameDataReason, GameSearchRequest>
{
    [HttpDelete("{id:guid}/all-rounds")]
    public async Task<VoidActionResult<ErrorInfo<AccessMultipleEntitiesError>>> DeleteAllRounds([FromServices] IDeleteAllRoundsInGameCommand command, [FromRoute] Guid id)
    {
        var result = await command.RunAsync(id);
        return result.ToActionResult();
    }
}