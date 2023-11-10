using Vostok.Configuration.Abstractions.Attributes;

namespace KotnurVersus.Web.Configuration;

[Secret]
public class WebSecrets
{
    [Required] public string DbConnectionString = null!;
}