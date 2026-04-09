export type DashboardOverview = {
  latestBodyWeight: { weightKg: number; logDate: string } | null;
  latestKpiSnapshot: KpiSnapshot | null;
  activeNutritionRecommendation: {
    dailyCaloriesKcal: number;
    proteinG: number;
    carbohydratesG: number;
    fatsG: number;
  } | null;
  activeWorkoutPlan: { name: string; daysPerWeek: number } | null;
  unreadNotificationsCount: number;
  activeEgoLiftAlertsCount: number;
};

export type StrengthRecord = {
  exerciseName: string;
  currentMaxWeightKg: number;
  achievedAt: string;
};

export type StrengthProgressResponse = {
  records: StrengthRecord[];
};

export type WeightTrendPeriod = "week" | "month" | "3months";

export type WeightTrendEntry = {
  logDate: string;
  weightKg: number;
};

export type WeightTrendResponse = {
  entries: WeightTrendEntry[];
  startWeight: number | null;
  endWeight: number | null;
  changeKg: number | null;
  changePct: number | null;
};

export type ConsistencyWeek = {
  weekStart: string;
  planned: number;
  completed: number;
  consistencyPct: number;
};

export type WorkoutConsistencyResponse = {
  weeks: ConsistencyWeek[];
  overallConsistencyPct: number;
  currentStreak: number;
};

export type NutritionAdherenceEntry = {
  date: string;
  loggedCaloriesKcal: number;
  targetCaloriesKcal: number;
  adherencePct: number;
};

export type NutritionAdherenceResponse = {
  entries: NutritionAdherenceEntry[];
  avgAdherencePct: number;
};

export type KpiSnapshot = {
  id: number;
  userId: number;
  snapshotDate: string;
  bodyWeightKg: number;
  totalSessionsWeek: number;
  plannedSessionsWeek: number;
  consistencyScore: number;
  strengthIndex: number;
  weeklyStreak: number;
  createdAt: string;
};

export type GetKpiSnapshotsParams = {
  startDate?: string;
  endDate?: string;
};

export type GetWeightTrendParams = {
  period?: WeightTrendPeriod;
};

export type GetNutritionAdherenceParams = {
  days?: number;
};

export type GetWorkoutConsistencyParams = {
  weeks?: number;
};
