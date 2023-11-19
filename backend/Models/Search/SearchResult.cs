namespace Models.Search;

public class SearchResult<T>
{
    public SearchResult()
    {
        Items = Array.Empty<T>();
    }

    public SearchResult(T[] items)
    {
        Items = items;
        Count = items.Length;
    }
        
    public T[] Items { get; set; }
    public int Count { get; set; }

    public override string ToString() => $"{nameof(Count)}: {Count}";
}