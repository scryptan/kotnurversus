using Domain.Commands.Base;
using Domain.Context;
using Domain.Services.Base;
using Models;
using Models.Challenges;

namespace Domain.Commands.Challenges;

public class CreateChallengeCommand : CreateCommandBase<Challenge, ChallengeCreationArgs, InvalidChallengeDataReason>
{
    public CreateChallengeCommand(IDataContextAccessor dataContextAccessor, IEntityService<Challenge> repository)
        : base(dataContextAccessor, repository)
    {
    }

    protected override Challenge ConvertToEntity(ChallengeCreationArgs args) => new()
    {
        Description = args.Description,
        Theme = args.Theme,
        Title = args.Title
    };

    protected override CreateErrorInfo<CreateEntityError, InvalidChallengeDataReason>? TryHandleConstraintViolation(string constraintName, Challenge entity)
    {
        if (constraintName == "IX_challenges_Title_Theme")
            return new CreateErrorInfo<CreateEntityError, InvalidChallengeDataReason>(CreateEntityError.InvalidData, "Duplicated Title with Theme")
            {
                InvalidDatas =
                {
                    InvalidData.Create(
                        "challenge.Title challenge.Theme",
                        $"{entity.Title} {entity.Theme}",
                        InvalidChallengeDataReason.DuplicatesThemeAndTitle)
                }
            };
        return null;
    }
}