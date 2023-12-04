using Domain.Commands.Base;
using Domain.Context;
using Domain.Services.Base;
using Models.Categories;

namespace Domain.Commands.Categories;

public class DeleteCategoryCommand : DeleteCommandBase<Category>
{
    public DeleteCategoryCommand(IDataContextAccessor dataContextAccessor, IEntityService<Category> service)
        : base(dataContextAccessor, service)
    {
    }
}