import { apiClient } from "@/libs/apiClient";

import type { UpdateProfileDto, UserProfile } from "../types";

export const userProfileApiService = {
  getProfile: async (): Promise<UserProfile> => {
    return apiClient.get<UserProfile>("/profile");
  },

  upsertProfile: async (dto: UpdateProfileDto): Promise<UserProfile> => {
    return apiClient.put<UserProfile>("/profile", dto);
  },
};
