using System.Diagnostics.CodeAnalysis;

namespace Core.Helpers;

public static class DictionaryExtensions
{
    public static TValue GetOrAdd<TKey, TValue>(this IDictionary<TKey, TValue> dct, TKey key, Func<TKey, TValue> valueFactory)
    {
        if (!dct.TryGetValue(key, out var result))
            dct.Add(key, result = valueFactory(key));
        return result;
    }

    public static TValue AddOrUpdate<TKey, TValue>(this IDictionary<TKey, TValue> dct, TKey key, Func<TKey, TValue> add, Func<TKey, TValue, TValue> update)
    {
        if (!dct.TryGetValue(key, out var result))
            dct.Add(key, result = add(key));
        else
            dct[key] = result = update(key, result);
        return result;
    }
        
    public static TValue AddOrUpdate<TKey, TValue>(this IDictionary<TKey, TValue> dct, TKey key, TValue add, Func<TKey, TValue, TValue> update)
    {
        if (!dct.TryGetValue(key, out var result))
            dct.Add(key, result = add);
        else
            dct[key] = result = update(key, result);
        return result;
    }
        
    [return:MaybeNull]
    public static TValue GetOrDefault<TKey, TValue>(this IDictionary<TKey, TValue> dct, TKey key)
    {
        dct.TryGetValue(key, out var result);
        return result;
    }
        
    [return:MaybeNull]
    public static TValue GetOrDefault<TKey, TValue>(this Dictionary<TKey, TValue> dct, TKey key)
        where TKey : notnull
    {
        dct.TryGetValue(key, out var result);
        return result;
    }

    [return:MaybeNull]
    public static TValue GetOrDefault<TKey, TValue>(this IReadOnlyDictionary<TKey, TValue> dct, TKey key)
    {
        dct.TryGetValue(key, out var result);
        return result;
    }

    public static async Task<TValue> GetOrAddAsync<TKey, TValue>(this IDictionary<TKey, TValue> dct, TKey key, Func<TKey, Task<TValue>> valueFactory)
    {
        if (!dct.TryGetValue(key, out var result))
            dct.Add(key, result = await valueFactory(key));
        return result;
    }
}