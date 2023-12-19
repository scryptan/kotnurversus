using Domain.Commands.Rounds;
using KotnurVersus.Web.Controllers.Base;
using KotnurVersus.Web.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Models;
using Models.Challenges;
using Models.Rounds;
using Models.Search;

namespace KotnurVersus.Web.Controllers;

public class RoundsController : CreatableEntityControllerBase<Round, RoundCreationArgs, InvalidRoundDataReason, RoundSearchRequest>
{
    private const long maxFileSize = 100 * 1024 * 1024;

    [HttpGet("{id:guid}/get-available-challenges")]
    public async Task<ActionResult<SearchResult<SnapshotChallenge>, ErrorInfo<AccessMultipleEntitiesError>>> GetAvailableChallenges(
        [FromServices] IGetAvailableChallengesCommand command,
        [FromRoute] Guid id)
    {
        var result = await command.RunAsync(id, HttpContext.RequestAborted);
        return result.ToActionResult();
    }
    
    [HttpDelete("{id:guid}/artifacts/{artifactId:guid}")]
    [Authorize]
    public async Task<VoidActionResult<ErrorInfo<AccessSingleEntityError>>> RemoveArtifact(
        [FromServices] IRemoveArtifactCommand command,
        [FromRoute] Guid id,
        [FromRoute] Guid artifactId)
    {
        var result = await command.RunAsync(
            id,
            artifactId);

        return result.ToActionResult();
    }

    [RequestFormLimits(
        MultipartBodyLengthLimit = 2 * maxFileSize,
        MultipartHeadersLengthLimit = MultipartReader.DefaultHeadersLengthLimit * 2)]
    [RequestSizeLimit(2 * maxFileSize)]
    [HttpPost("{id:guid}/add-artifact")]
    [Authorize]
    public async Task<ActionResult<Artifact, ErrorInfo<AccessSingleEntityError>>> AddArtifact(
        [FromServices] IAddArtifactCommand command,
        [FromRoute] Guid id,
        [FromForm] IFormFile? file,
        [FromForm] string? description)
    {
        var memoryStream = new MemoryStream();
        if (file != null)
            await file.CopyToAsync(memoryStream);

        var result = await command.RunAsync(
            id,
            file == null ? ArtifactType.Text : ArtifactType.Image,
            memoryStream,
            file?.FileName,
            description);

        return result.ToActionResult();
    }

    [HttpPost("{id:guid}/reset-timer")]
    [Authorize]
    public async Task<ActionResult<Round, ErrorInfo<InvalidRoundDataReason>>> ResetRoundTimer(
        [FromServices] IResetTimerCommand command,
        [FromRoute] Guid id)
    {
        var result = await command.RunAsync(id, HttpContext.RequestAborted);
        return result.ToActionResult();
    }

    [HttpPost("{id:guid}/init")]
    [Authorize]
    public async Task<ActionResult<Round, ErrorInfo<InvalidRoundDataReason>>> InitRound(
        [FromServices] IStartRoundCommand command,
        [FromRoute] Guid id)
    {
        var result = await command.RunAsync(id);
        return result.ToActionResult();
    }

    [HttpPost("{id:guid}/finish")]
    [Authorize]
    public async Task<ActionResult<Round, ErrorInfo<InvalidRoundDataReason>>> FinishRound(
        [FromServices] IFinishRoundCommand command,
        [FromRoute] Guid id,
        [FromBody] FinishRoundRequest request)
    {
        var result = await command.RunAsync(id, request.Marks);
        return result.ToActionResult();
    }

    [HttpPost("{id:guid}/start/{state}")]
    [Authorize]
    public async Task<ActionResult<Round, ErrorInfo<InvalidRoundDataReason>>> StartRoundState(
        [FromServices] IProcessRoundCommand command,
        [FromRoute] Guid id,
        [FromRoute] RoundState state,
        [FromQuery] Guid? teamId)
    {
        var result = await command.RunAsync(id, state, teamId, true);
        return result.ToActionResult();
    }

    [HttpPost("{id:guid}/end/{state}")]
    [Authorize]
    public async Task<ActionResult<Round, ErrorInfo<InvalidRoundDataReason>>> EndRoundState(
        [FromServices] IProcessRoundCommand command,
        [FromRoute] Guid id,
        [FromRoute] RoundState state,
        [FromQuery] Guid? teamId)
    {
        var result = await command.RunAsync(id, state, teamId, false);
        return result.ToActionResult();
    }
}