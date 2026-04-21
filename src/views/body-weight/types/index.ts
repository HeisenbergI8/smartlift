export type WeightSource = "manual" | "smart_scale" | "coach";

export type BodyWeightLog = {
  id: number;
  userId: number;
  logDate: string;
  weightKg: number;
  source: WeightSource;
  notes?: string | null;
  createdAt: string;
  updatedAt?: string;
};

export type WeeklyAverage = {
  weekStart: string;
  avgWeightKg: number;
  entryCount: number;
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
  page?: number;
  limit?: number;
};

export type BodyWeightLogsResponse = {
  data: BodyWeightLog[];
  total: number;
  page: number;
  limit: number;
};

export type GetWeeklyAveragesParams = {
  weeks?: number;
};
