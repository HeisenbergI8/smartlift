import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import { bodyWeightRtkConfig } from "@/configs/bodyWeightRtkConfig";
import { bodyWeightApiService } from "@/views/body-weight/services/bodyWeightApi";
import type {
  BodyWeightLog,
  BodyWeightLogsResponse,
  GetBodyWeightLogsParams,
  GetWeeklyAveragesParams,
  LogBodyWeightDto,
  WeeklyAverage,
} from "@/views/body-weight/types";

export const bodyWeightApi = createApi({
  reducerPath: bodyWeightRtkConfig.reducerPath,
  baseQuery: fakeBaseQuery(),
  tagTypes: bodyWeightRtkConfig.tagTypes,
  endpoints: (build) => ({
    getBodyWeightLogs: build.query<
      BodyWeightLogsResponse,
      GetBodyWeightLogsParams | void
    >({
      queryFn: async (params) => {
        try {
          const data = await bodyWeightApiService.getLogs(params ?? undefined);
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "BodyWeightLogs" as const,
                id,
              })),
              { type: "BodyWeightLogs" as const, id: "LIST" },
            ]
          : [{ type: "BodyWeightLogs" as const, id: "LIST" }],
    }),

    getLatestBodyWeight: build.query<BodyWeightLog | null, void>({
      queryFn: async () => {
        try {
          const data = await bodyWeightApiService.getLatest();
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: [{ type: "BodyWeightLatest" as const, id: "LATEST" }],
    }),

    getWeeklyAverages: build.query<
      WeeklyAverage[],
      GetWeeklyAveragesParams | void
    >({
      queryFn: async (params) => {
        try {
          const data = await bodyWeightApiService.getWeeklyAverages(
            params ?? undefined,
          );
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: [{ type: "BodyWeightWeekly" as const, id: "LIST" }],
    }),

    logBodyWeight: build.mutation<BodyWeightLog, LogBodyWeightDto>({
      queryFn: async (dto) => {
        try {
          const data = await bodyWeightApiService.logWeight(dto);
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: [
        { type: "BodyWeightLogs" as const, id: "LIST" },
        { type: "BodyWeightLatest" as const, id: "LATEST" },
        { type: "BodyWeightWeekly" as const, id: "LIST" },
      ],
    }),

    deleteBodyWeightLog: build.mutation<void, number>({
      queryFn: async (id) => {
        try {
          await bodyWeightApiService.deleteLog(id);
          return { data: undefined };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: [
        { type: "BodyWeightLogs" as const, id: "LIST" },
        { type: "BodyWeightLatest" as const, id: "LATEST" },
        { type: "BodyWeightWeekly" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetBodyWeightLogsQuery,
  useGetLatestBodyWeightQuery,
  useGetWeeklyAveragesQuery,
  useLogBodyWeightMutation,
  useDeleteBodyWeightLogMutation,
} = bodyWeightApi;
