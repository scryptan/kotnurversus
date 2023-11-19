using System;
using System.Collections.Generic;
using Db.Dbo;
using Db.Dbo.Games;
using Db.Dbo.Rounds;
using Microsoft.EntityFrameworkCore.Migrations;
using Models.Rounds;
using Models.Settings;
using Models.Specifications;
using Models.Teams;

#nullable disable

namespace Db.Migrations
{
    /// <inheritdoc />
    public partial class AddMainEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Title",
                table: "challenges",
                newName: "title");

            migrationBuilder.RenameColumn(
                name: "Theme",
                table: "challenges",
                newName: "theme");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "challenges",
                newName: "description");

            migrationBuilder.RenameIndex(
                name: "IX_challenges_Title_Theme",
                table: "challenges",
                newName: "IX_challenges_title_theme");

            migrationBuilder.AddColumn<bool>(
                name: "is_cat_in_bag",
                table: "challenges",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "games",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    teams = table.Column<List<Team>>(type: "jsonb", nullable: false),
                    settings = table.Column<Settings>(type: "jsonb", nullable: false),
                    specifications = table.Column<List<Specification>>(type: "jsonb", nullable: false),
                    title = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    start_date = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    form = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_games", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "rounds",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    history = table.Column<List<HistoryItem>>(type: "jsonb", nullable: false),
                    game_id = table.Column<Guid>(type: "uuid", nullable: false),
                    specification = table.Column<Specification>(type: "jsonb", nullable: true),
                    participants = table.Column<List<Participant>>(type: "jsonb", nullable: false),
                    next_round_id = table.Column<Guid>(type: "uuid", nullable: true),
                    order = table.Column<int>(type: "integer", nullable: false),
                    artifacts = table.Column<List<Artifact>>(type: "jsonb", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_rounds", x => x.id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "games");

            migrationBuilder.DropTable(
                name: "rounds");

            migrationBuilder.DropColumn(
                name: "is_cat_in_bag",
                table: "challenges");

            migrationBuilder.RenameColumn(
                name: "title",
                table: "challenges",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "theme",
                table: "challenges",
                newName: "Theme");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "challenges",
                newName: "Description");

            migrationBuilder.RenameIndex(
                name: "IX_challenges_title_theme",
                table: "challenges",
                newName: "IX_challenges_Title_Theme");
        }
    }
}
