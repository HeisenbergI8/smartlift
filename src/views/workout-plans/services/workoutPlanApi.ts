import { apiClient } from "@/libs/apiClient";
import type {
  CreateWorkoutPlanDayDto,
  CreateWorkoutPlanDto,
  GenerateWorkoutPlanDto,
  UpdateWorkoutPlanDto,
  WorkoutPlan,
} from "../types";

export const workoutPlanApiService = {
  findAll: async (): Promise<WorkoutPlan[]> => {
    return apiClient.get<WorkoutPlan[]>("/workout-plans");
  },

  // The list endpoint returns plans without nested days. We find the active plan
  // from the list, then fetch its full details so that `days` is always populated.
  findActive: async (): Promise<WorkoutPlan> => {
    const plans = await apiClient.get<WorkoutPlan[]>("/workout-plans");
    const active = plans.find((p) => p.isActive);
    if (!active) throw new Error("No active workout plan");
    return apiClient.get<WorkoutPlan>(`/workout-plans/${active.id}`);
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

  // Backend has no dedicated /days endpoint — fetch current plan then PUT with merged days
  addDay: async (
    planId: number,
    dto: CreateWorkoutPlanDayDto,
  ): Promise<WorkoutPlan> => {
    const current = await apiClient.get<WorkoutPlan>(
      `/workout-plans/${planId}`,
    );
    const existingDays: CreateWorkoutPlanDayDto[] = current.days.map((d) => ({
      dayNumber: d.dayNumber,
      name: d.name ?? undefined,
      isRestDay: d.isRestDay,
      exercises: d.exercises.map((ex) => ({
        exerciseId: ex.exerciseId,
        sortOrder: ex.sortOrder,
        targetSets: ex.targetSets,
        targetRepsMin: ex.targetRepsMin,
        targetRepsMax: ex.targetRepsMax,
        targetWeightKg: ex.targetWeightKg ?? undefined,
        targetRpe: ex.targetRpe ?? undefined,
        restSeconds: ex.restSeconds ?? undefined,
        notes: ex.notes ?? undefined,
      })),
    }));
    return apiClient.put<WorkoutPlan>(`/workout-plans/${planId}`, {
      days: [...existingDays, dto],
    });
  },

  // Backend has no /deactivate endpoint — use the update endpoint to set isActive: false
  deactivate: async (id: number): Promise<WorkoutPlan> => {
    return apiClient.put<WorkoutPlan>(`/workout-plans/${id}`, {
      isActive: false,
    });
  },
};
