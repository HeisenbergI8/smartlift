import { apiClient } from "@/libs/apiClient";
import type { BodyRegion, MuscleGroup } from "../types";

function toArray<T>(res: T[] | { data: T[] }): T[] {
  return Array.isArray(res) ? res : res.data;
}

export const muscleGroupApiService = {
  getAll: async (): Promise<MuscleGroup[]> => {
    const res = await apiClient.get<MuscleGroup[] | { data: MuscleGroup[] }>(
      "/muscle-groups",
    );
    return toArray(res);
  },

  getByRegion: async (bodyRegion: BodyRegion): Promise<MuscleGroup[]> => {
    const res = await apiClient.get<MuscleGroup[] | { data: MuscleGroup[] }>(
      "/muscle-groups",
      {
        params: { bodyRegion },
      },
    );
    return toArray(res);
  },
};
