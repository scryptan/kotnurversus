using Db.Dbo.Users;
using Models.Authorization;

namespace Domain.Helpers;

public static class UserHelpers
{
    public static User ToApiModel(this UserDbo user)
    {
        return new User
        {
            Email = user.Email,
            IsAuthorized = user.IsAuthorized,
        };
    }
}