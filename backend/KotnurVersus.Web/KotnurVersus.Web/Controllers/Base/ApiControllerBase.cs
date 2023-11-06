using Domain.Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Vostok.Logging.Abstractions;
using Core.Helpers;

namespace KotnurVersus.Web.Controllers.Base;

[ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
[ApiController]
[Route(RoutePrefix + "[controller]")]
public abstract class ApiControllerBase : Controller
{
    protected const string RoutePrefix = "api/v1/";

    protected string? GetAuthScheme() => User.Identities.FirstOrDefault()?.AuthenticationType;

    protected virtual async Task RunInContextAsync(ActionExecutingContext context, Func<Task> next)
    {
        var systemContextAccessor = HttpContext.RequestServices.GetRequiredService<ISystemContextAccessor>();

        using (systemContextAccessor.SetSystemContext("WebApp"))
            await next();
    }

    public override void OnActionExecuted(ActionExecutedContext context)
    {
        base.OnActionExecuted(context);
        if (context.Result is ConflictObjectResult conflict)
        {
            var log = HttpContext.RequestServices.GetRequiredService<ILog>().ForContext(this);
            log.Warn("Api conflict occured: {error}", Serializer.Serialize(conflict.Value));
        }
    }

    public sealed override Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        return RunInContextAsync(context, () => base.OnActionExecutionAsync(context, next));
    }

    private string GetClaim(string claimName)
    {
        var claim = User.FindFirst(claimName)?.Value;
        if (string.IsNullOrEmpty(claim))
            return string.Empty;

        return claim;
    }
}