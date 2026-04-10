export type Gender = "male" | "female" | "other";

export type FitnessGoal = "lose_weight" | "gain_muscle" | "maintain";

export type ActivityLevel =
  | "sedentary"
  | "lightly_active"
  | "moderately_active"
  | "very_active"
  | "extra_active";

export type TrainingMethod = "weight_training" | "bodyweight" | "hybrid";

export type UserProfile = {
  id: number;
  userId: number;
  heightCm: number | null;
  weightKg: number | null;
  age: number | null;
  gender: Gender | null;
  fitnessGoal: FitnessGoal | null;
  activityLevel: ActivityLevel | null;
  trainingMethod: TrainingMethod | null;
  trainingDaysPerWeek: number | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateProfileDto = {
  heightCm?: number;
  weightKg?: number;
  age?: number;
  gender?: Gender;
  fitnessGoal?: FitnessGoal;
  activityLevel?: ActivityLevel;
  trainingMethod?: TrainingMethod;
  trainingDaysPerWeek?: number;
};
