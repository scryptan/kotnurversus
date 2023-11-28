using KotnurVersus.Web.Controllers.Base;
using Models.Categories;

namespace KotnurVersus.Web.Controllers;

public class CategoriesController : CreatableEntityControllerBase<Category, CategoryCreationArgs, InvalidCategoryDataReason, CategorySearchRequest>
{
}