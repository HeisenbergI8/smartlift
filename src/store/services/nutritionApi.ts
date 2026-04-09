import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import { nutritionRtkConfig } from "@/configs/nutritionRtkConfig";
import {
  nutritionApiService,
  dailyNutritionApiService,
} from "@/views/nutrition/services/nutritionApi";
import type {
  CreateNutritionRecommendationDto,
  DailyNutritionLog,
  DailyNutritionLogsResponse,
  GetDailyLogsParams,
  LogDailyNutritionDto,
  NutritionAdjustment,
  NutritionRecommendation,
  NutritionRecommendationsResponse,
  PlateauDetectResult,
} from "@/views/nutrition/types";

export const nutritionApi = createApi({
  reducerPath: nutritionRtkConfig.reducerPath,
  baseQuery: fakeBaseQuery(),
  tagTypes: nutritionRtkConfig.tagTypes,
  endpoints: (build) => ({
    getActiveNutritionRecommendation: build.query<
      NutritionRecommendation | null,
      void
    >({
      queryFn: async () => {
        try {
          const data = await nutritionApiService.getActiveRecommendation();
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: [{ type: "NutritionActive" as const, id: "ACTIVE" }],
    }),

    getAllNutritionRecommendations: build.query<
      NutritionRecommendationsResponse,
      void
    >({
      queryFn: async () => {
        try {
          const data = await nutritionApiService.getAllRecommendations();
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "NutritionHistory" as const,
                id,
              })),
              { type: "NutritionHistory" as const, id: "LIST" },
            ]
          : [{ type: "NutritionHistory" as const, id: "LIST" }],
    }),

    createNutritionRecommendation: build.mutation<
      NutritionRecommendation,
      CreateNutritionRecommendationDto
    >({
      queryFn: async (dto) => {
        try {
          const data = await nutritionApiService.createRecommendation(dto);
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: [
        { type: "NutritionActive" as const, id: "ACTIVE" },
        { type: "NutritionHistory" as const, id: "LIST" },
      ],
    }),

    generateNutritionRecommendation: build.mutation<
      NutritionRecommendation,
      void
    >({
      queryFn: async () => {
        try {
          const data = await nutritionApiService.generateRecommendation();
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: [
        { type: "NutritionActive" as const, id: "ACTIVE" },
        { type: "NutritionHistory" as const, id: "LIST" },
      ],
    }),

    getDailyNutritionLogs: build.query<
      DailyNutritionLogsResponse,
      GetDailyLogsParams | void
    >({
      queryFn: async (params) => {
        try {
          const data = await dailyNutritionApiService.getDailyLogs(
            params ?? undefined,
          );
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "NutritionDailyLogs" as const,
                id,
              })),
              { type: "NutritionDailyLogs" as const, id: "LIST" },
            ]
          : [{ type: "NutritionDailyLogs" as const, id: "LIST" }],
    }),

    logDailyNutrition: build.mutation<DailyNutritionLog, LogDailyNutritionDto>({
      queryFn: async (dto) => {
        try {
          const data = await dailyNutritionApiService.logDailyNutrition(dto);
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: [{ type: "NutritionDailyLogs" as const, id: "LIST" }],
    }),

    getNutritionAdjustmentHistory: build.query<NutritionAdjustment[], void>({
      queryFn: async () => {
        try {
          const data = await dailyNutritionApiService.getAdjustmentHistory();
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: [{ type: "NutritionAdjustments" as const, id: "LIST" }],
    }),

    detectPlateau: build.mutation<PlateauDetectResult, void>({
      queryFn: async () => {
        try {
          const data = await dailyNutritionApiService.detectPlateau();
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: [
        { type: "NutritionActive" as const, id: "ACTIVE" },
        { type: "NutritionHistory" as const, id: "LIST" },
        { type: "NutritionAdjustments" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetActiveNutritionRecommendationQuery,
  useGetAllNutritionRecommendationsQuery,
  useCreateNutritionRecommendationMutation,
  useGenerateNutritionRecommendationMutation,
  useGetDailyNutritionLogsQuery,
  useLogDailyNutritionMutation,
  useGetNutritionAdjustmentHistoryQuery,
  useDetectPlateauMutation,
} = nutritionApi;
