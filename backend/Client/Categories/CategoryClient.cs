using Client.Base;
using Models.Categories;
using Vostok.Clusterclient.Core;
using Vostok.Logging.Abstractions;

namespace Client.Categories;

internal class CategoryClient : EntityClientBase<Category, CategoryCreationArgs, CategorySearchRequest, InvalidCategoryDataReason>, ICategoryClient
{
    public CategoryClient(IClusterClient client, ILog log, string route)
        : base(client, log, route)
    {
    }
}