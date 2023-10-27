namespace Models;

public abstract class EntityInfo
{
    /// <summary>
    ///     Идентификатор сущности
    /// </summary>
    public Guid Id { get; set; }

    public override string ToString() => $"{nameof(Id)}: {Id}";
}