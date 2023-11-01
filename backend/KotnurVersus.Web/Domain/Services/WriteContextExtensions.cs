using System.Linq.Expressions;
using Domain.Services.Helpers;
using Models;

namespace Domain.Services;

public static class WriteContextExtensions
{
    public static void AddInvalidData<T, TInvalidDataReason, TValue>(
        this IWriteContext<T, TInvalidDataReason> writeContext,
        Expression<Func<T, TValue>> path,
        TValue value,
        TInvalidDataReason reason)
        where TInvalidDataReason : struct, Enum
    {
        writeContext.AddInvalidData(new InvalidData<TInvalidDataReason>(PatchPath.GetPath(path), value, reason));
    }

    public static void AddInvalidData<T, TInvalidDataReason, TValue>(
        this IWriteContext<T, TInvalidDataReason> writeContext,
        Expression<Func<T, ISet<TValue>>> path,
        TValue value,
        TInvalidDataReason reason)
        where TInvalidDataReason : struct, Enum
    {
        writeContext.AddInvalidData(new InvalidData<TInvalidDataReason>(PatchPath.GetPath(path), value, reason));
    }

    public static void AddInvalidData<T, TInvalidDataReason, TValue>(
        this IWriteContext<T, TInvalidDataReason> writeContext,
        Expression<Func<T, IDictionary<string, TValue>>> path,
        string key,
        TValue value,
        TInvalidDataReason reason)
        where TInvalidDataReason : struct, Enum
    {
        writeContext.AddInvalidData(new InvalidData<TInvalidDataReason>(PatchPath.Combine(PatchPath.GetPath(path), key), value, reason));
    }

    public static void AddError<T, TInvalidDataReason, TValue>(
        this IWriteContext<T, TInvalidDataReason> writeContext,
        Expression<Func<T, TValue>> path,
        TValue value,
        TInvalidDataReason reason)
        where TInvalidDataReason : struct, Enum
    {
        writeContext.AddInvalidData(path, value, reason);
    }

    public static void AddError<T, TInvalidDataReason, TValue>(
        this IWriteContext<T, TInvalidDataReason> writeContext,
        Expression<Func<T, ISet<TValue>>> path,
        TValue value,
        TInvalidDataReason reason)
        where TInvalidDataReason : struct, Enum
    {
        writeContext.AddInvalidData(path, value, reason);
    }

    public static void AddError<T, TInvalidDataReason, TValue>(
        this IWriteContext<T, TInvalidDataReason> writeContext,
        Expression<Func<T, IDictionary<string, TValue>>> path,
        string key,
        TValue value,
        TInvalidDataReason reason)
        where TInvalidDataReason : struct, Enum
    {
        writeContext.AddInvalidData(path, key, value, reason);
    }
}