import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import { dashboardRtkConfig } from "@/configs/dashboardRtkConfig";
import { dashboardApiService } from "@/views/dashboard/services/dashboardApi";
import type {
  DashboardOverview,
  GetKpiSnapshotsParams,
  GetNutritionAdherenceParams,
  GetWeightTrendParams,
  GetWorkoutConsistencyParams,
  KpiSnapshot,
  NutritionAdherenceResponse,
  StrengthProgressResponse,
  WeightTrendResponse,
  WorkoutConsistencyResponse,
} from "@/views/dashboard/types";

export const dashboardApi = createApi({
  reducerPath: dashboardRtkConfig.reducerPath,
  baseQuery: fakeBaseQuery(),
  tagTypes: dashboardRtkConfig.tagTypes,
  endpoints: (build) => ({
    getDashboardOverview: build.query<DashboardOverview, void>({
      queryFn: async () => {
        try {
          const data = await dashboardApiService.getOverview();
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: [{ type: "DashboardOverview" as const, id: "OVERVIEW" }],
    }),

    getStrengthProgress: build.query<StrengthProgressResponse, void>({
      queryFn: async () => {
        try {
          const data = await dashboardApiService.getStrengthProgress();
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: [{ type: "DashboardStrength" as const, id: "STRENGTH" }],
    }),

    getWeightTrend: build.query<
      WeightTrendResponse,
      GetWeightTrendParams | void
    >({
      queryFn: async (params) => {
        try {
          const data = await dashboardApiService.getWeightTrend(
            params ?? undefined,
          );
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: [{ type: "DashboardWeightTrend" as const, id: "LIST" }],
    }),

    getWorkoutConsistency: build.query<
      WorkoutConsistencyResponse,
      GetWorkoutConsistencyParams | void
    >({
      queryFn: async (params) => {
        try {
          const data = await dashboardApiService.getWorkoutConsistency(
            params ?? undefined,
          );
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: [
        { type: "DashboardConsistency" as const, id: "CONSISTENCY" },
      ],
    }),

    getNutritionAdherence: build.query<
      NutritionAdherenceResponse,
      GetNutritionAdherenceParams | void
    >({
      queryFn: async (params) => {
        try {
          const data = await dashboardApiService.getNutritionAdherence(
            params ?? undefined,
          );
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: [
        { type: "DashboardNutritionAdherence" as const, id: "ADHERENCE" },
      ],
    }),

    getKpiSnapshots: build.query<KpiSnapshot[], GetKpiSnapshotsParams | void>({
      queryFn: async (params) => {
        try {
          const data = await dashboardApiService.getKpiSnapshots(
            params ?? undefined,
          );
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: [{ type: "DashboardKpiSnapshots" as const, id: "LIST" }],
    }),

    createKpiSnapshot: build.mutation<KpiSnapshot, void>({
      queryFn: async () => {
        try {
          const data = await dashboardApiService.createKpiSnapshot();
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: [
        { type: "DashboardOverview" as const, id: "OVERVIEW" },
        { type: "DashboardKpiSnapshots" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetDashboardOverviewQuery,
  useGetStrengthProgressQuery,
  useGetWeightTrendQuery,
  useGetWorkoutConsistencyQuery,
  useGetNutritionAdherenceQuery,
  useGetKpiSnapshotsQuery,
  useCreateKpiSnapshotMutation,
} = dashboardApi;
