import { Operation } from "fast-json-patch";
import { Challenge } from "~/types/challenge";
import { PaginationResponse } from "~/types/pagination";
import { FinishRound, Round, RoundArtifact, RoundState } from "~/types/round";
import axiosClient from "~/utils/axios-client";

export class RoundsController {
  async getById(id: string): Promise<Round> {
    return await axiosClient.get(`/api/v1/Rounds/${id}`);
  }

  async findByTourneyId(tourneyId: string): Promise<PaginationResponse<Round>> {
    const response = await axiosClient.get<PaginationResponse<Round>>(
      "/api/v1/Rounds",
      {
        GameId: tourneyId,
      }
    );
    return {
      ...response,
      items: response.items
        .sort((a, b) => a.order - b.order)
        .map((round) => ({
          ...round,
          participants: round.participants.sort((a, b) => a.order - b.order),
        })),
    };
  }

  async findAvailableChallenges(
    id: string
  ): Promise<PaginationResponse<Challenge>> {
    const response = await axiosClient.get<PaginationResponse<Challenge>>(
      `/api/v1/Rounds/${id}/get-available-challenges`
    );
    const sortedItems = response.items.sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );

    return { ...response, items: sortedItems };
  }

  async patch(id: string, operations: Operation[]): Promise<Round> {
    return await axiosClient.patch(`/api/v1/Rounds/${id}`, operations);
  }

  async init(id: string): Promise<Round> {
    return await axiosClient.post(`/api/v1/Rounds/${id}/init`);
  }

  async start(id: string, state: RoundState, teamId?: string): Promise<Round> {
    return await axiosClient.post(
      `/api/v1/Rounds/${id}/start/${state}`,
      undefined,
      teamId ? { params: { teamId } } : {}
    );
  }

  async end(id: string, state: RoundState, teamId?: string): Promise<Round> {
    return await axiosClient.post(
      `/api/v1/Rounds/${id}/end/${state}`,
      undefined,
      teamId ? { params: { teamId } } : {}
    );
  }

  async finish(id: string, data: FinishRound): Promise<Round> {
    return await axiosClient.post(`/api/v1/Rounds/${id}/finish`, data);
  }

  async resetTimer(id: string): Promise<Round> {
    return await axiosClient.post(`/api/v1/Rounds/${id}/reset-timer`);
  }

  async addArtifact(id: string, file: File): Promise<RoundArtifact> {
    const formData = new FormData();
    formData.append("file", file);
    return await axiosClient.post(
      `/api/v1/Rounds/${id}/add-artifact`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  }

  async deleteArtifact(id: string, artifactId: string): Promise<void> {
    return await axiosClient.delete(
      `/api/v1/Rounds/${id}/artifacts/${artifactId}`
    );
  }
}
