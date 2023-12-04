using Db.Dbo.Categories;
using Domain.Context;
using Domain.Services.Base;
using Domain.Services.Challenges;
using Models.Categories;
using Models.Challenges;

namespace Domain.Services.Categories;

public class CategoriesService : EntityServiceBase<Category, CategoryDbo, CategorySearchRequest>, ICategoriesService
{
    private readonly IChallengesService challengesService;

    public CategoriesService(IDataContext context, IChallengesService challengesService)
        : base(context, x => x.Categories)
    {
        this.challengesService = challengesService;
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

    protected override async Task AfterDeleteAsync(Category entity)
    {
        await base.AfterDeleteAsync(entity);
        var linkedChallenges = await challengesService.SearchAsync(
            new ChallengeSearchRequest
            {
                CategoryId = entity.Id
            },
            new CancellationToken());

        foreach (var challenge in linkedChallenges.Items)
        {
            await challengesService.DeleteAsync(challenge);
        }
    }
}