import { apiClient } from "@/libs/apiClient";

import type {
  AuthResponse,
  LoginDto,
  MeResponse,
  RegisterDto,
  User,
} from "../types";

export const authApiService = {
  login: async (dto: LoginDto): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>("/auth/login", dto);
  },

  register: async (dto: RegisterDto): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>("/auth/register", dto);
  },

  getMe: async (): Promise<User> => {
    const data = await apiClient.get<MeResponse>("/auth/me");
    return {
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      isCoachMode: data.isCoachMode,
      accountType: data.role.toLowerCase() as "user" | "coach",
    };
  },
};
