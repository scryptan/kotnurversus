using Microsoft.AspNetCore.Mvc;

namespace KotnurVersus.Web.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthorizationController : ControllerBase
{
    
    public async Task<IActionResult> Get()
    {
        return Ok();
    }
}