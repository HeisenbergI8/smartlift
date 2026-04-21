import { apiClient } from "@/libs/apiClient";
import type {
  DashboardOverview,
  GetKpiSnapshotsParams,
  GetNutritionAdherenceParams,
  GetWeightTrendParams,
  GetWorkoutConsistencyParams,
  KpiSnapshot,
  KpiSnapshotsResponse,
  NutritionAdherenceResponse,
  StrengthProgressResponse,
  WeightTrendResponse,
  WorkoutConsistencyResponse,
} from "../types";

export const dashboardApiService = {
  getOverview(): Promise<DashboardOverview> {
    return apiClient.get<DashboardOverview>("/dashboard/overview");
  },

  getStrengthProgress(): Promise<StrengthProgressResponse> {
    return apiClient.get<StrengthProgressResponse>(
      "/dashboard/strength-progress",
    );
  },

  getWeightTrend(params?: GetWeightTrendParams): Promise<WeightTrendResponse> {
    return apiClient.get<WeightTrendResponse>("/dashboard/weight-trend", {
      params: { period: params?.period },
    });
  },

  getWorkoutConsistency(
    params?: GetWorkoutConsistencyParams,
  ): Promise<WorkoutConsistencyResponse> {
    return apiClient.get<WorkoutConsistencyResponse>(
      "/dashboard/workout-consistency",
      { params: { weeks: params?.weeks } },
    );
  },

  getNutritionAdherence(
    params?: GetNutritionAdherenceParams,
  ): Promise<NutritionAdherenceResponse> {
    return apiClient.get<NutritionAdherenceResponse>(
      "/dashboard/nutrition-adherence",
      { params: { days: params?.days } },
    );
  },

  getKpiSnapshots(
    params?: GetKpiSnapshotsParams,
  ): Promise<KpiSnapshotsResponse> {
    return apiClient.get<KpiSnapshotsResponse>("/dashboard/kpi-snapshots", {
      params: {
        startDate: params?.startDate,
        endDate: params?.endDate,
        page: params?.page,
        limit: params?.limit,
      },
    });
  },

  createKpiSnapshot(): Promise<KpiSnapshot> {
    return apiClient.post<KpiSnapshot>("/dashboard/kpi-snapshot");
  },
};
