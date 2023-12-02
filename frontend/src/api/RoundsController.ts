import { Operation } from "fast-json-patch";
import { PaginationResponse } from "~/types/pagination";
import { FinishRound, Round, RoundState } from "~/types/round";
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
      teamId ? { teamId } : {}
    );
  }

  async end(id: string, state: RoundState, teamId?: string): Promise<Round> {
    return await axiosClient.post(
      `/api/v1/Rounds/${id}/end/${state}`,
      undefined,
      teamId ? { teamId } : {}
    );
  }

  async finish(id: string, data: FinishRound): Promise<Round> {
    return await axiosClient.post(`/api/v1/Rounds/${id}/finish`, data);
  }

  async resetTimer(id: string): Promise<Round> {
    return await axiosClient.post(`/api/v1/Rounds/${id}/reset-timer`);
  }
}
