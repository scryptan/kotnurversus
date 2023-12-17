using Core.Helpers;
using Microsoft.AspNetCore.Authorization;

namespace KotnurVersus.Web.Authorization;

public class AuthorizedHandler : AuthorizationHandler<AuthorizedRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, AuthorizedRequirement requirement)
    {
        var isAuthorizedClaim = context.User.FindFirst(c => c.Type == CustomClaim.IsAuthorized);
        if (isAuthorizedClaim is not null)
        {
            var authorizedValue = bool.Parse(isAuthorizedClaim.Value);
            if (authorizedValue == requirement.IsAuthorized)
                context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}