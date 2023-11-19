namespace Models.Search;

public class SearchRequestBase : ISearchRequest
{
    public int? Limit { get; set; }
}