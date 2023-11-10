using Domain;
using Models;

namespace KotnurVersus.Web.Helpers;

public static class ModelsExtensions
{
    public static ActionResult<T, TErrorInfo> ToActionResult<T, TErrorStatus, TErrorInfo>(this DomainResult<T, TErrorStatus, TErrorInfo> domainResult)
        where TErrorStatus : struct, Enum
        where TErrorInfo : ErrorInfo<TErrorStatus>
        where T : class
    {
        if (domainResult.Result != null)
            return domainResult.Result;
        return domainResult.ErrorInfo ?? throw new InvalidOperationException("domainResult.ErrorInfo == null");
    }

    public static VoidActionResult<TErrorInfo> ToActionResult<TErrorStatus, TErrorInfo>(this VoidDomainResult<TErrorStatus, TErrorInfo> domainResult)
        where TErrorStatus : struct, Enum
        where TErrorInfo : ErrorInfo<TErrorStatus>
    {
        return domainResult.ErrorInfo ?? VoidActionResult<TErrorInfo>.Success;
    }
}