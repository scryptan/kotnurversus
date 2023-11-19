using Microsoft.EntityFrameworkCore.Migrations;
using Models.Settings;

#nullable disable

namespace Db.Migrations
{
    /// <inheritdoc />
    public partial class AddRoundFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Settings>(
                name: "settings",
                table: "rounds",
                type: "jsonb",
                nullable: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "settings",
                table: "rounds");
        }
    }
}
