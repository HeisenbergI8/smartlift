import { apiClient } from "@/libs/apiClient";
import type {
  GetMusclePrioritiesParams,
  MusclePrioritiesResponse,
  UpsertMusclePriorityDto,
  UserMusclePriority,
} from "../types";

export const musclePriorityApiService = {
  getUserPriorities: async (
    params?: GetMusclePrioritiesParams,
  ): Promise<UserMusclePriority[]> => {
    const res = await apiClient.get<MusclePrioritiesResponse>(
      "/muscle-priorities",
      { params: { page: 1, limit: 100, ...params } },
    );
    return res.data;
  },

  upsertPriority: async (
    dto: UpsertMusclePriorityDto,
  ): Promise<UserMusclePriority> => {
    return apiClient.put<UserMusclePriority>("/muscle-priorities", dto);
  },

  deletePriority: async (muscleGroupId: number): Promise<void> => {
    return apiClient.delete(`/muscle-priorities/${muscleGroupId}`);
  },
};
