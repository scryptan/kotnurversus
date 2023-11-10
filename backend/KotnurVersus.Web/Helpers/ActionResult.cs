using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace KotnurVersus.Web.Helpers;

public class ActionResult<TValue, TError> : IConvertToActionResult
    where TValue : class
    where TError : class 
{
    private ActionResult(TValue value)
    {
        Value = value;
    }

    private ActionResult(TError error)
    {
        Error = error;
    }

    private ActionResult(IActionResult result)
    {
        Result = result ?? throw new ArgumentNullException(nameof(result));
    }

    private IActionResult? Result { get; }
    public TValue? Value { get; }
    public TError? Error { get; }

    public static implicit operator ActionResult<TValue, TError>(TValue value)
    {
        return new ActionResult<TValue, TError>(value);
    }

    public static implicit operator ActionResult<TValue, TError>(TError error)
    {
        return new ActionResult<TValue, TError>(error);
    }

    public static implicit operator ActionResult<TValue, TError>(ActionResult result)
    {
        return new ActionResult<TValue, TError>(result);
    }

    IActionResult IConvertToActionResult.Convert()
    {
        if (Result != null)
            return Result;
        if (Error != null)
            return new ConflictObjectResult(Error);
        return new ObjectResult(Value);
    }
}