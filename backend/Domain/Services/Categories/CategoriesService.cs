using Db.Dbo.Categories;
using Domain.Context;
using Domain.Services.Base;
using Models.Categories;

namespace Domain.Services.Categories;

public class CategoriesService : EntityServiceBase<Category, CategoryDbo, CategorySearchRequest>, ICategoriesService
{
    public CategoriesService(IDataContext context)
        : base(context, x => x.Categories)
    {
    }

    protected override Task FillDboAsync(CategoryDbo dbo, Category entity)
    {
        dbo.Id = entity.Id;
        dbo.Title = entity.Title;
        dbo.Color = entity.Color;

        return Task.CompletedTask;
    }

    protected override Task FillEntityAsync(Category entity, CategoryDbo dbo)
    {
        entity.Id = dbo.Id;
        entity.Title = dbo.Title;
        entity.Color = dbo.Color;

        return Task.CompletedTask;
    }
}