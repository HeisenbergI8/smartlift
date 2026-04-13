import { apiClient } from "@/libs/apiClient";
import type {
  CreateWorkoutPlanDto,
  GenerateWorkoutPlanDto,
  UpdateWorkoutPlanDto,
  WorkoutPlan,
} from "../types";

export const workoutPlanApiService = {
  findAll: async (): Promise<WorkoutPlan[]> => {
    return apiClient.get<WorkoutPlan[]>("/workout-plans");
  },

  findActive: async (): Promise<WorkoutPlan> => {
    return apiClient.get<WorkoutPlan>("/workout-plans/active");
  },

  findOne: async (id: number): Promise<WorkoutPlan> => {
    return apiClient.get<WorkoutPlan>(`/workout-plans/${id}`);
  },

  create: async (dto: CreateWorkoutPlanDto): Promise<WorkoutPlan> => {
    return apiClient.post<WorkoutPlan>("/workout-plans", dto);
  },

  update: async (
    id: number,
    dto: UpdateWorkoutPlanDto,
  ): Promise<WorkoutPlan> => {
    return apiClient.put<WorkoutPlan>(`/workout-plans/${id}`, dto);
  },

  activate: async (id: number): Promise<WorkoutPlan> => {
    return apiClient.patch<WorkoutPlan>(`/workout-plans/${id}/activate`, {});
  },

  generate: async (dto: GenerateWorkoutPlanDto): Promise<WorkoutPlan> => {
    return apiClient.post<WorkoutPlan>("/workout-plans/generate", dto);
  },

  remove: async (id: number): Promise<void> => {
    return apiClient.delete(`/workout-plans/${id}`);
  },
};
