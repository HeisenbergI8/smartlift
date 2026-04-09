export type Severity = "warning" | "critical";

export type TrainingGoal = "strength" | "hypertrophy" | "endurance";

export type EgoLiftAlert = {
  id: number;
  userId: number;
  exerciseId: number;
  workoutSetId: number;
  severity: Severity;
  message: string;
  previousWeightKg: number;
  flaggedWeightKg: number;
  previousReps: number;
  flaggedReps: number;
  trainingGoal: TrainingGoal;
  isDismissed: boolean;
  createdAt: string;
  exercise: {
    id: number;
    name: string;
  };
};

export type EgoLiftAlertsResponse = {
  data: EgoLiftAlert[];
};

export type GetEgoLiftAlertsParams = {
  page?: number;
  limit?: number;
};
