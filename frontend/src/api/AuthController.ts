import { AuthRequest, AuthResponse } from "~/types/auth";
import axiosClient from "~/utils/axios-client";

export class AuthController {
  async register(data: AuthRequest): Promise<AuthResponse> {
    return await axiosClient.post("/api/v1/Authorization/register", data);
  }

  async login(data: AuthRequest): Promise<AuthResponse> {
    return await axiosClient.post("/api/v1/Authorization/login", data);
  }

  async setAuthorized(
    id: string,
    isAuthorized: boolean
  ): Promise<AuthResponse> {
    return await axiosClient.post(
      "/api/v1/Authorization/set-authorized",
      undefined,
      { id, isAuthorized }
    );
  }
}
