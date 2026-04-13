import type { Exercise } from "@/views/exercises/types";

export type TrainingGoal = "strength" | "hypertrophy" | "endurance" | "general";

export type PlanSource = "user" | "system";

export type WorkoutPlanExercise = {
  id: number;
  workoutPlanDayId: number;
  exerciseId: number;
  sortOrder: number;
  targetSets: number;
  targetRepsMin: number;
  targetRepsMax: number;
  targetWeightKg: number | null;
  targetRpe: number | null;
  restSeconds: number | null;
  notes: string | null;
  exercise: Exercise;
};

export type WorkoutPlanDay = {
  id: number;
  workoutPlanId: number;
  dayNumber: number;
  name: string | null;
  isRestDay: boolean;
  exercises: WorkoutPlanExercise[];
};

export type WorkoutPlan = {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  trainingGoal: TrainingGoal;
  daysPerWeek: number;
  durationWeeks: number;
  startedAt: string | null;
  endedAt: string | null;
  isActive: boolean;
  source: PlanSource;
  createdAt: string;
  updatedAt: string;
  days: WorkoutPlanDay[];
};

export type CreateWorkoutPlanDayExerciseDto = {
  exerciseId: number;
  sortOrder: number;
  targetSets: number;
  targetRepsMin: number;
  targetRepsMax: number;
  targetWeightKg?: number;
  targetRpe?: number;
  restSeconds?: number;
  notes?: string;
};

export type CreateWorkoutPlanDayDto = {
  dayNumber: number;
  name?: string;
  isRestDay?: boolean;
  exercises: CreateWorkoutPlanDayExerciseDto[];
};

export type CreateWorkoutPlanDto = {
  name: string;
  description?: string;
  trainingGoal: TrainingGoal;
  daysPerWeek: number;
  durationWeeks: number;
  startedAt?: string;
  days: CreateWorkoutPlanDayDto[];
};

export type UpdateWorkoutPlanDto = {
  name?: string;
  description?: string;
  trainingGoal?: TrainingGoal;
  daysPerWeek?: number;
  durationWeeks?: number;
  startedAt?: string;
};

export type GenerateWorkoutPlanDto = {
  name?: string;
  trainingGoalOverride?: TrainingGoal;
  daysPerWeekOverride?: number;
};
