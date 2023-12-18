import { AuthRequest, AuthResponse, User } from "~/types/auth";
import axiosClient from "~/utils/axios-client";

export class AuthController {
  async register(data: AuthRequest): Promise<AuthResponse> {
    return await axiosClient.post("/api/v1/Authorization/register", data);
  }

  async login(data: AuthRequest): Promise<AuthResponse> {
    return await axiosClient.post("/api/v1/Authorization/login", data);
  }

  async setAuthorized(id: string, isAuthorized: boolean): Promise<User> {
    return await axiosClient.post(
      "/api/v1/Authorization/set-authorized",
      undefined,
      { id, isAuthorized }
    );
  }

  async findUsers(): Promise<User[]> {
    return await axiosClient.get("/api/v1/Authorization/users");
  }
}
