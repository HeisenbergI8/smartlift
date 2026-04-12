import { apiClient } from "@/libs/apiClient";
import type {
  Exercise,
  ExercisesResponse,
  FindExercisesParams,
} from "../types";

export const exerciseApiService = {
  getExercises: async (
    params: FindExercisesParams,
  ): Promise<ExercisesResponse> => {
    return apiClient.get<ExercisesResponse>("/exercises", { params });
  },

  getExercise: async (id: number): Promise<Exercise> => {
    return apiClient.get<Exercise>(`/exercises/${id}`);
  },
};
