import type { MuscleGroup } from "@/views/muscle-groups/types";

export type PriorityLevel = "low" | "normal" | "high";

export type UserMusclePriority = {
  id: number;
  userId: number;
  muscleGroupId: number;
  priorityLevel: PriorityLevel;
  hasImbalance: boolean;
  notes: string | null;
  muscleGroup: MuscleGroup;
  createdAt: string;
  updatedAt: string;
};

export type MusclePrioritiesResponse = {
  data: UserMusclePriority[];
  total: number;
  page: number;
  limit: number;
};

export type GetMusclePrioritiesParams = {
  page?: number;
  limit?: number;
};

export type UpsertMusclePriorityDto = {
  muscleGroupId: number;
  priorityLevel?: PriorityLevel;
  hasImbalance?: boolean;
  notes?: string;
};
