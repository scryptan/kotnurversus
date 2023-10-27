using System.ComponentModel.DataAnnotations.Schema;

namespace Db.Dbo;

public abstract class Dbo
{
    [Column("id"), DatabaseGenerated(DatabaseGeneratedOption.None)]
    public Guid Id { get; set; }
}