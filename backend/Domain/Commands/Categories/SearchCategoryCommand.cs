using Domain.Commands.Base;
using Domain.Context;
using Domain.Services.Base;
using Models.Categories;

namespace Domain.Commands.Categories;

public class SearchCategoryCommand : SearchCommandBase<Category, CategorySearchRequest>
{
    public SearchCategoryCommand(IEntityService<Category, CategorySearchRequest> service, IDataContextAccessor dataContextAccessor)
        : base(service, dataContextAccessor)
    {
    }
}