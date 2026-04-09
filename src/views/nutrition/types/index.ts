export type NutritionSource = "system" | "coach" | "manual";

export type NutritionRecommendation = {
  id: number;
  userId: number;
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
  source: NutritionSource;
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
};

export type DailyNutritionLogsResponse = {
  data: DailyNutritionLog[];
  meta: {
    total: number;
  };
};

export type NutritionAdjustmentTrigger =
  | "plateau_detected"
  | "weight_trend"
  | "goal_change"
  | "coach_override";

export type NutritionAdjustment = {
  id: number;
  nutritionRecommendationId: number;
  trigger: NutritionAdjustmentTrigger;
  previousCaloriesKcal: number;
  newCaloriesKcal: number;
  previousProteinG: number;
  newProteinG: number;
  previousCarbsG: number;
  newCarbsG: number;
  previousFatsG: number;
  newFatsG: number;
  reason: string | null;
  createdAt: string;
  nutritionRecommendation: NutritionRecommendation;
};

export type PlateauDetectResult = {
  plateauDetected: boolean;
  reason?: string;
  adjustment?: NutritionAdjustment;
  newRecommendation?: NutritionRecommendation;
};
