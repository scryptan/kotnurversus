using Domain.Commands.Base;
using Domain.Context;
using Domain.Services.Base;
using Models.Categories;

namespace Domain.Commands.Categories;

public class CreateCategoryCommand : CreateCommandBase<Category, CategoryCreationArgs, InvalidCategoryDataReason>
{
    public CreateCategoryCommand(IDataContextAccessor dataContextAccessor, IEntityService<Category> service)
        : base(dataContextAccessor, service)
    {
    }

    protected override Category ConvertToEntity(CategoryCreationArgs args) => new()
    {
        Color = args.Color,
        Title = args.Title
    };
}