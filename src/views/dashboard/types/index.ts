export type ActiveRecommendation = {
  id: number;
  userId: number;
  source: string;
  dailyCaloriesKcal: number;
  proteinG: number;
  carbohydratesG: number;
  fatsG: number;
  isActive: boolean;
  effectiveFrom: string;
  effectiveTo: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DashboardOverview = {
  latestWeight: { weightKg: number; logDate: string } | null;
  latestSnapshot: KpiSnapshot | null;
  activeRecommendation: ActiveRecommendation | null;
  activePlan: { id: number; name: string; daysPerWeek: number } | null;
  unreadNotifications: number;
  activeEgoAlerts: number;
};

export type StrengthRecord = {
  exerciseId: number;
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
  page?: number;
  limit?: number;
};

export type KpiSnapshotsResponse = {
  data: KpiSnapshot[];
  total: number;
  page: number;
  limit: number;
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
