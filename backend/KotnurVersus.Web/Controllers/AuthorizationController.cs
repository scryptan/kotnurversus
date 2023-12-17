using System.Security.Claims;
using Core.Helpers;
using Domain.Commands.Authorization;
using KotnurVersus.Web.Helpers;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models;
using Models.Authorization;

namespace KotnurVersus.Web.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthorizationController : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<User, ErrorInfo<AccessSingleEntityError>>> Register(
        [FromServices] IRegisterCommand command,
        [FromBody] UserRegisterRequest request)
    {
        var result = await command.RunAsync(request);
        if (result.Result != null)
        {
            var user = result.Result;
            await HttpContext.SignInAsync(CreateClaimsPrincipal(user));
            return Ok(result);
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
            await HttpContext.SignInAsync(CreateClaimsPrincipal(user));
            return Ok(result);
        }

        return result.ToActionResult();
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Login()
    {
        await HttpContext.SignOutAsync();
        return Ok();
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

    private ClaimsPrincipal CreateClaimsPrincipal(User user)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(CustomClaim.IsAuthorized, user.IsAuthorized.ToString())
        };

        var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        return new ClaimsPrincipal(claimsIdentity);
    }
}