using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Db.Migrations
{
    /// <inheritdoc />
    public partial class AddCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_challenges_title_theme",
                table: "challenges");

            migrationBuilder.DropColumn(
                name: "theme",
                table: "challenges");

            migrationBuilder.AddColumn<Guid>(
                name: "categoryId",
                table: "challenges",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "categories",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    title = table.Column<string>(type: "text", nullable: false),
                    color = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_categories", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_challenges_title_categoryId",
                table: "challenges",
                columns: new[] { "title", "categoryId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "categories");

            migrationBuilder.DropIndex(
                name: "IX_challenges_title_categoryId",
                table: "challenges");

            migrationBuilder.DropColumn(
                name: "categoryId",
                table: "challenges");

            migrationBuilder.AddColumn<string>(
                name: "theme",
                table: "challenges",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_challenges_title_theme",
                table: "challenges",
                columns: new[] { "title", "theme" },
                unique: true);
        }
    }
}
