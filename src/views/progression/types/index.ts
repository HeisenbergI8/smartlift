export type ProgressionFrequency = "weekly" | "biweekly" | "monthly";

export type TrainingGoal = "strength" | "hypertrophy" | "endurance";

export type AdjustmentType =
  | "weight_increase"
  | "weight_decrease"
  | "reps_increase"
  | "sets_increase"
  | "deload";

export type ProgressionSettings = {
  id: number;
  userId: number;
  isEnabled: boolean;
  progressionFrequency: ProgressionFrequency;
  trainingGoal: TrainingGoal;
  weightIncrementKg: number;
  maxRepsBeforeIncrease: number;
  createdAt: string;
  updatedAt: string;
};

export type ProgressionHistoryItem = {
  id: number;
  userId: number;
  exerciseId: number;
  adjustmentType: AdjustmentType;
  previousValue: number;
  newValue: number;
  reason: string;
  source: string;
  createdAt: string;
  exercise: {
    id: number;
    name: string;
  };
};

export type GetProgressionHistoryParams = {
  page: number;
  limit: number;
};

export type GetProgressionHistoryByExerciseParams = {
  exerciseId: number;
  page: number;
  limit: number;
};

export type ProgressionHistoryResponse = {
  data: ProgressionHistoryItem[];
  total: number;
  page: number;
  limit: number;
};

export type EvaluateProgressionResponse = {
  message: string;
  adjustments: ProgressionHistoryItem[];
};

export type UpdateProgressionSettingsDto = {
  isEnabled?: boolean;
  progressionFrequency?: ProgressionFrequency;
  trainingGoal?: TrainingGoal;
  weightIncrementKg?: number;
  maxRepsBeforeIncrease?: number;
};
