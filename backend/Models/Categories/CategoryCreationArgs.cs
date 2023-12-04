namespace Models.Categories;

public class CategoryCreationArgs : EntityCreationArgs
{
    public string Title { get; set; } = null!;
    public string Color { get; set; } = null!;
}