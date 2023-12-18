using Domain.Commands.Authorization;
using KotnurVersus.Web.Configuration;
using KotnurVersus.Web.Helpers;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using Models;
using Models.Authorization;

namespace KotnurVersus.Web.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthorizationController : ControllerBase
{
    private readonly IAuthSettings authSettings;

    public AuthorizationController(IAuthSettings authSettings)
    {
        this.authSettings = authSettings;
    }

    [HttpGet("users")]
    [Authorize]
    public async Task<ActionResult<IEnumerable<User>, ErrorInfo<AccessMultipleEntitiesError>>> GetUsers(
        [FromServices] IGetUsersCommand command)
    {
        var result = await command.RunAsync();

        return result.ToActionResult();
    }

    [HttpPost("register")]
    public async Task<ActionResult<User, ErrorInfo<AccessSingleEntityError>>> Register(
        [FromServices] IRegisterCommand command,
        [FromBody] UserRegisterRequest request)
    {
        var result = await command.RunAsync(request);
        if (result.Result != null)
        {
            var user = result.Result;

            return Ok(GetTokenResult(user));
        }

        return result.ToActionResult();
    }

    [HttpPost("login")]
    public async Task<ActionResult<User, ErrorInfo<AccessSingleEntityError>>> Login(
        [FromServices] ILoginCommand command,
        [FromBody] UserLoginRequest request)
    {
        var result = await command.RunAsync(request);
        if (result.Result != null)
        {
            var user = result.Result;

            return Ok(GetTokenResult(user));
        }

        return result.ToActionResult();
    }

    [HttpPost("set-authorized")]
    [Authorize]
    public async Task<ActionResult<User, ErrorInfo<AccessSingleEntityError>>> Login(
        [FromServices] ISetAuthorizedCommand command,
        [FromQuery] Guid id,
        [FromQuery] bool isAuthorized)
    {
        var result = await command.RunAsync(id, isAuthorized);

        return result.ToActionResult();
    }

    private object GetTokenResult(User user)
    {
        var token = JwtTokens.GenerateToken(user, authSettings);
        return new
        {
            JwtConstants.TokenType,
            User = user,
            Token = token
        };
    }
}