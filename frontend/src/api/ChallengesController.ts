import { compare } from "fast-json-patch";
import { Challenge, CreateChallenge } from "~/types/challenge";
import { PaginationResponse } from "~/types/pagination";
import axiosClient from "~/utils/axios-client";

export class ChallengesController {
  async create(data: CreateChallenge): Promise<Challenge> {
    return await axiosClient.post("/api/v1/Challenges", data);
  }

  async getById(id: string): Promise<Challenge> {
    return await axiosClient.get(`/api/v1/Challenges/${id}`);
  }

  async find(): Promise<PaginationResponse<Challenge>> {
    return await axiosClient.get("/api/v1/Challenges");
  }

  async update(
    challenge: Challenge,
    newData: CreateChallenge
  ): Promise<Challenge> {
    const operations = compare(challenge, { ...challenge, ...newData });
    return await axiosClient.patch(
      `/api/v1/Challenges/${challenge.id}`,
      operations
    );
  }
}
