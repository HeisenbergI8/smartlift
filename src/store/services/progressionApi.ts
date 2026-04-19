import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import { progressionRtkConfig } from "@/configs/progressionRtkConfig";
import { progressionApiService } from "@/views/progression/services/progressionApi";
import type {
  EvaluateProgressionResponse,
  GetProgressionHistoryByExerciseParams,
  GetProgressionHistoryParams,
  ProgressionHistoryResponse,
  ProgressionSettings,
  UpdateProgressionSettingsDto,
} from "@/views/progression/types";

export const progressionApi = createApi({
  reducerPath: progressionRtkConfig.reducerPath,
  baseQuery: fakeBaseQuery(),
  tagTypes: progressionRtkConfig.tagTypes,
  endpoints: (build) => ({
    getProgressionSettings: build.query<ProgressionSettings, void>({
      queryFn: async () => {
        try {
          const data = await progressionApiService.getSettings();
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: [{ type: "ProgressionSettings" as const, id: "SETTINGS" }],
    }),

    upsertProgressionSettings: build.mutation<
      ProgressionSettings,
      UpdateProgressionSettingsDto
    >({
      queryFn: async (dto) => {
        try {
          const data = await progressionApiService.upsertSettings(dto);
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: [
        { type: "ProgressionSettings" as const, id: "SETTINGS" },
      ],
    }),

    getProgressionHistory: build.query<
      ProgressionHistoryResponse,
      GetProgressionHistoryParams
    >({
      queryFn: async (params) => {
        try {
          const data = await progressionApiService.getHistory(params);
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "ProgressionHistory" as const,
                id,
              })),
              { type: "ProgressionHistory" as const, id: "LIST" },
            ]
          : [{ type: "ProgressionHistory" as const, id: "LIST" }],
    }),

    getProgressionHistoryByExercise: build.query<
      ProgressionHistoryResponse,
      GetProgressionHistoryByExerciseParams
    >({
      queryFn: async (params) => {
        try {
          const data = await progressionApiService.getHistoryByExercise(params);
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "ProgressionHistory" as const,
                id,
              })),
              { type: "ProgressionHistory" as const, id: "LIST" },
            ]
          : [{ type: "ProgressionHistory" as const, id: "LIST" }],
    }),

    evaluateProgression: build.mutation<EvaluateProgressionResponse, void>({
      queryFn: async () => {
        try {
          const data = await progressionApiService.evaluateProgression();
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: [{ type: "ProgressionHistory" as const, id: "LIST" }],
    }),
  }),
});

export const {
  useGetProgressionSettingsQuery,
  useUpsertProgressionSettingsMutation,
  useGetProgressionHistoryQuery,
  useGetProgressionHistoryByExerciseQuery,
  useEvaluateProgressionMutation,
} = progressionApi;
