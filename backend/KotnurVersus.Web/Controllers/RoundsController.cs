using KotnurVersus.Web.Controllers.Base;
using Models.Rounds;

namespace KotnurVersus.Web.Controllers;

public class RoundsController : CreatableEntityControllerBase<Round, RoundCreationArgs, InvalidRoundDataReason, RoundSearchRequest>
{
}