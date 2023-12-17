using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Core.Helpers;
using KotnurVersus.Web.Configuration;
using Microsoft.IdentityModel.Tokens;
using Models.Authorization;

namespace KotnurVersus.Web.Helpers;

public static class JwtTokens
{
    public static SymmetricSecurityKey SigningKey(string key) =>
        new(Encoding.ASCII.GetBytes(key));

    public static string GenerateToken(User user, IAuthSettings settings)
    {
        var claims = new Claim[]
        {
            new(JwtRegisteredClaimNames.Sid, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email),
            new(CustomClaim.IsAuthorized, user.IsAuthorized.ToString()),
        };

        var jwt = new JwtSecurityToken(
            issuer: "Kotnur",
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: DateTime.UtcNow.AddDays(30),
            signingCredentials: new SigningCredentials(SigningKey(settings.JwtKey), SecurityAlgorithms.HmacSha256));
        var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

        return encodedJwt;
    }
}