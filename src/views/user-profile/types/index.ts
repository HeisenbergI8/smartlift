export type Gender = "male" | "female" | "other";

export type FitnessGoal =
  | "lose_weight"
  | "build_muscle"
  | "maintain"
  | "improve_strength"
  | "improve_endurance";

export type ActivityLevel =
  | "sedentary"
  | "lightly_active"
  | "moderately_active"
  | "very_active"
  | "extremely_active";

export type TrainingMethod =
  | "free_weights"
  | "machines"
  | "bodyweight"
  | "mixed";

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
