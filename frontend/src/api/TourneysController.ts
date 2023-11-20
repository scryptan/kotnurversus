import { CreateTourney, Tourney } from "~/types/tourney";
import axiosClient from "~/utils/axios-client";

export class TourneysController {
  async create(data: CreateTourney): Promise<Tourney> {
    return await axiosClient.post("/api/v1/Games", data);
  }
}
