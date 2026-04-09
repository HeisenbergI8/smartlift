export type WeightSource = "manual" | "smart_scale" | "coach";

export type BodyWeightLog = {
  id: number;
  userId: number;
  logDate: string;
  weightKg: number;
  source: WeightSource;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WeeklyAverage = {
  weekStart: string;
  weekEnd: string;
  averageWeightKg: number;
  logCount: number;
};

export type LogBodyWeightDto = {
  logDate: string;
  weightKg: number;
  source: WeightSource;
  notes?: string;
};

export type GetBodyWeightLogsParams = {
  startDate?: string;
  endDate?: string;
};

export type BodyWeightLogsResponse = {
  data: BodyWeightLog[];
  meta: {
    total: number;
  };
};

export type GetWeeklyAveragesParams = {
  weeks?: number;
};
