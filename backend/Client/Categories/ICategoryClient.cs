using Client.Base;
using Models.Categories;

namespace Client.Categories;

public interface ICategoryClient : IClientBase<Category, CategoryCreationArgs, CategorySearchRequest, InvalidCategoryDataReason>
{
}