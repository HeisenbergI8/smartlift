import type { AuthResponse, LoginDto, RegisterDto } from "../types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authApiService = {
  login: async (dto: LoginDto): Promise<AuthResponse> => {
    await delay(800);
    return {
      accessToken: `mock-jwt-${Date.now()}`,
      user: {
        id: 1,
        email: dto.email,
        firstName: "John Ross",
        lastName: "Rivera",
        isCoachMode: false,
        accountType: "user",
      },
    };
  },

  register: async (dto: RegisterDto): Promise<AuthResponse> => {
    await delay(800);
    return {
      accessToken: `mock-jwt-${Date.now()}`,
      user: {
        id: 1,
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        isCoachMode: dto.isCoachMode,
        accountType: dto.accountType,
      },
    };
  },
};
