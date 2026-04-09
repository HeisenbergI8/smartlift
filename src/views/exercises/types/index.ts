import type { Equipment } from "@/views/equipment/types";
import type { MuscleGroup } from "@/views/muscle-groups/types";

export type ExerciseCategory =
  | "compound"
  | "isolation"
  | "cardio"
  | "bodyweight";

export type ExerciseDifficulty = "beginner" | "intermediate" | "advanced";

export type ExerciseMuscle = {
  id: number;
  exerciseId: number;
  muscleGroupId: number;
  muscleGroup: MuscleGroup;
};

export type ExerciseEquipment = {
  id: number;
  exerciseId: number;
  equipmentId: number;
  equipment: Equipment;
};

export type Exercise = {
  id: number;
  name: string;
  description: string | null;
  category: ExerciseCategory;
  difficulty: ExerciseDifficulty;
  createdAt: string;
  updatedAt: string;
  exerciseMuscles: ExerciseMuscle[];
  exerciseEquipment: ExerciseEquipment[];
};

export type FindExercisesParams = {
  page: number;
  limit: number;
  search?: string;
  category?: ExerciseCategory;
  difficulty?: ExerciseDifficulty;
  muscleGroupId?: number;
  equipmentId?: number;
};

export type ExercisesResponse = {
  data: Exercise[];
  total: number;
  page: number;
  limit: number;
};
