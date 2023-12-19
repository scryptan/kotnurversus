using Db.Dbo.Challenges;
using Domain.Context;
using Domain.Services.Base;
using Domain.Services.Categories;
using Models;
using Models.Challenges;

namespace Domain.Services.Challenges;

public class ChallengesService : EntityServiceBase<Challenge, ChallengeDbo, ChallengeSearchRequest>, IChallengesService
{
    private readonly Lazy<ICategoriesService> categoriesService;

    public ChallengesService(IDataContext context, Lazy<ICategoriesService> categoriesService)
        : base(context, x => x.Challenges)
    {
        this.categoriesService = categoriesService;
    }

    protected override Task FillDboAsync(ChallengeDbo dbo, Challenge entity)
    {
        dbo.Description = entity.Description;
        dbo.Id = entity.Id;
        dbo.CategoryId = entity.CategoryId;
        dbo.Title = entity.Title;
        dbo.IsCatInBag = entity.IsCatInBag;

        return Task.CompletedTask;
    }

    protected override Task FillEntityAsync(Challenge entity, ChallengeDbo dbo)
    {
        entity.Description = dbo.Description;
        entity.Id = dbo.Id;
        entity.CategoryId = dbo.CategoryId;
        entity.Title = dbo.Title;
        entity.IsCatInBag = dbo.IsCatInBag;

        return Task.CompletedTask;
    }

    protected override async Task<IQueryable<ChallengeDbo>> ApplyFilterAsync(IQueryable<ChallengeDbo> queryable, ChallengeSearchRequest searchRequest)
    {
        var res = queryable;

        if (searchRequest.CategoryId != null)
            res = res.Where(x => x.CategoryId == searchRequest.CategoryId.Value);

        if (searchRequest.ExcludeIds != null)
            res = res.Where(x => !searchRequest.ExcludeIds.Contains(x.Id));

        res = await base.ApplyFilterAsync(res, searchRequest);
        return res;
    }

    protected override async Task PreprocessAsync(Challenge? entity)
    {
        if (entity == null)
            return;

        var category = await categoriesService.Value.FindAsync(entity.CategoryId);
        if (category == null)
            throw new EntityNotFoundException($"Category with id: {entity.CategoryId} not found");
    }
}