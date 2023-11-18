using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace KotnurVersus.Web.Helpers;

public class VoidActionResult<TError> : IConvertToActionResult
    where TError : class 
{
    private VoidActionResult()
    {
    }

    private VoidActionResult(TError error)
    {
        Error = error;
    }

    private VoidActionResult(IActionResult result)
    {
        Result = result ?? throw new ArgumentNullException(nameof(result));
    }

    private IActionResult? Result { get; }
    public TError? Error { get; }

    public static readonly VoidActionResult<TError> Success = new();

    public static implicit operator VoidActionResult<TError>(TError error)
    {
        return new VoidActionResult<TError>(error);
    }

    public static implicit operator VoidActionResult<TError>(ActionResult result)
    {
        return new VoidActionResult<TError>(result);
    }

    IActionResult IConvertToActionResult.Convert()
    {
        if (Result != null)
            return Result;
        if (Error != null)
            return new ConflictObjectResult(Error);
        return new OkResult();
    }
}