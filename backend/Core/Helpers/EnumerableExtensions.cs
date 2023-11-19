namespace Core.Helpers;

public static class EnumerableExtensions
{
    public static IEnumerable<T> ToEnumerableOrEmpty<T>(this T? value)
        where T : struct
    {
        if (value.HasValue)
            yield return value.Value;
    }

    public static async Task<TResult[]> ToArrayAsync<TResult>(this IEnumerable<Task<TResult>> tasks)
    {
        var result = new List<TResult>();
        foreach (var task in tasks)
            result.Add(await task);
        return result.ToArray();
    }

    public static async Task<bool> AllAsync(this IEnumerable<Task<bool>> tasks)
    {
        foreach (var task in tasks)
            if (!await task)
                return false;
        return true;
    }

    public static Task<bool> AllAsync<T>(this IEnumerable<T> enumerable, Func<T, Task<bool>> process)
    {
        return enumerable.Select(process).AllAsync();
    }

    public static async Task<bool> AnyAsync(this IEnumerable<Task<bool>> tasks)
    {
        foreach (var task in tasks)
            if (await task)
                return true;
        return false;
    }

    public static Task<bool> AnyAsync<T>(this IEnumerable<T> enumerable, Func<T, Task<bool>> process)
    {
        return enumerable.Select(process).AnyAsync();
    }

    public static async Task ForEachAsync(this IEnumerable<Func<Task>> tasks)
    {
        foreach (var task in tasks)
            await task();
    }

    public static async Task ForEachAsync<T>(this IEnumerable<T> enumerable, Func<T, Task> process)
    {
        foreach (var item in enumerable)
            await process(item);
    }
}