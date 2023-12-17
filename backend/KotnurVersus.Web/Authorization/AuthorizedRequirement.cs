using Microsoft.AspNetCore.Authorization;

namespace KotnurVersus.Web.Authorization;

public class AuthorizedRequirement : IAuthorizationRequirement
{
    protected internal bool IsAuthorized => true;
}