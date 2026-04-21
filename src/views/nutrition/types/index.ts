export type NutritionSource = "system" | "coach" | "manual";

export type NutritionRecommendation = {
  id: number;
  userId: number;
  createdBy: number | null;
  dailyCaloriesKcal: number;
  proteinG: number;
  carbohydratesG: number;
  fatsG: number;
  effectiveFrom: string;
  effectiveTo: string | null;
  notes: string | null;
  source: NutritionSource;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateNutritionRecommendationDto = {
  dailyCaloriesKcal: number;
  proteinG: number;
  carbohydratesG: number;
  fatsG: number;
  effectiveFrom: string;
  effectiveTo?: string | null;
  notes?: string | null;
};

export type NutritionRecommendationsResponse = {
  data: NutritionRecommendation[];
  meta: {
    total: number;
  };
};

export type DailyNutritionLog = {
  id: number;
  userId: number;
  logDate: string;
  totalCaloriesKcal: number | null;
  proteinG: number | null;
  carbohydratesG: number | null;
  fatsG: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LogDailyNutritionDto = {
  logDate: string;
  totalCaloriesKcal?: number;
  proteinG?: number;
  carbohydratesG?: number;
  fatsG?: number;
  notes?: string;
};

export type GetDailyLogsParams = {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
};

export type DailyNutritionLogsResponse = {
  data: DailyNutritionLog[];
  total: number;
  page: number;
  limit: number;
};

export type GetAdjustmentHistoryParams = {
  page?: number;
  limit?: number;
};

export type NutritionAdjustmentTrigger =
  | "plateau_detected"
  | "weight_trend"
  | "goal_change"
  | "coach_override";

export type NutritionAdjustment = {
  id: number;
  userId: number;
  nutritionRecommendationId: number;
  triggerReason: NutritionAdjustmentTrigger;
  previousCaloriesKcal: number;
  newCaloriesKcal: number;
  previousProteinG: number;
  newProteinG: number;
  previousCarbohydratesG: number;
  newCarbohydratesG: number;
  previousFatsG: number;
  newFatsG: number;
  weeklyAvgWeightKg: number | null;
  notes: string | null;
  source: string;
  createdAt: string;
  nutritionRecommendation: NutritionRecommendation;
};

export type NutritionAdjustmentsResponse = {
  data: NutritionAdjustment[];
  total: number;
  page: number;
  limit: number;
};

export type PlateauDetectResult = {
  plateauDetected: boolean;
  reason?: string;
  adjustment?: NutritionAdjustment;
  newRecommendation?: NutritionRecommendation;
};
