import { PaginationResponse } from "~/types/pagination";
import { Round } from "~/types/round";
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

  async init(id: string): Promise<Round> {
    return await axiosClient.post(`/api/v1/Rounds/${id}/init`);
  }
}
