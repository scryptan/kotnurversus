namespace Models.Categories;

public class Category : EntityInfo, IEntity
{
    public string Title { get; set; } = null!;
    public string Color { get; set; } = null!;
}