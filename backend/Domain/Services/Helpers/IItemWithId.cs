namespace Domain.Services.Helpers;

public interface IItemWithId
{
}

public interface IItemWithId<out T> : IItemWithId
{
    T Id { get; }
}