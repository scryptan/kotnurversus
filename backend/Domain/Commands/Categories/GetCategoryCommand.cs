using Domain.Commands.Base;
using Domain.Context;
using Domain.Services.Base;
using Models.Categories;

namespace Domain.Commands.Categories;

public class GetCategoryCommand : GetCommandBase<Category>
{
    public GetCategoryCommand(IDataContextAccessor dataContextAccessor, IEntityService<Category> repository)
        : base(dataContextAccessor, repository)
    {
    }
}