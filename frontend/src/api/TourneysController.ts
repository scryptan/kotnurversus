import { Operation, compare } from "fast-json-patch";
import { PaginationResponse } from "~/types/pagination";
import { CreateTourney, Tourney } from "~/types/tourney";
import axiosClient from "~/utils/axios-client";

export class TourneysController {
  async create(data: CreateTourney): Promise<Tourney> {
    return await axiosClient.post("/api/v1/Games", data);
  }

  async getById(id: string): Promise<Tourney> {
    return await axiosClient.get(`/api/v1/Games/${id}`);
  }

  async find(): Promise<PaginationResponse<Tourney>> {
    return await axiosClient.get("/api/v1/Games");
  }

  async update(tourney: Tourney, newData: CreateTourney): Promise<Tourney> {
    const operations = compare(
      { ...tourney, startDate: tourney.startDate.toJSON() },
      { ...tourney, ...newData, startDate: newData.startDate.toJSON() }
    );
    return await axiosClient.patch(`/api/v1/Games/${tourney.id}`, operations);
  }

  async patch(id: string, operations: Operation[]): Promise<Tourney> {
    return await axiosClient.patch(`/api/v1/Games/${id}`, operations);
  }

  async delete(id: string): Promise<void> {
    await axiosClient.delete(`/api/v1/Games/${id}`);
  }
}
