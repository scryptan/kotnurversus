import { PaginationResponse } from "~/types/pagination";
import { CreateTourney, Tourney } from "~/types/tourney";
import axiosClient from "~/utils/axios-client";

export class TourneysController {
  readonly queryKeys = {
    find: () => ["tourneys"] as const,
  };

  async create(data: CreateTourney): Promise<Tourney> {
    return await axiosClient.post("/api/v1/Games", data);
  }

  async find(): Promise<PaginationResponse<Tourney>> {
    return await axiosClient.get("/api/v1/Games");
  }
}
