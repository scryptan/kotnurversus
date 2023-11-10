using KotnurVersus.Web.Controllers.Base;
using Models.Games;

namespace KotnurVersus.Web.Controllers;

public class GamesController : CreatableEntityControllerBase<Game, GameCreationArgs, InvalidGameDataReason, GameSearchRequest>
{
}