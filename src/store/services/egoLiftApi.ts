import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import { egoLiftRtkConfig } from "@/configs/egoLiftRtkConfig";
import { egoLiftApiService } from "@/views/ego-lift/services/egoLiftApi";
import type { EgoLiftAlertsResponse } from "@/views/ego-lift/types";

export const egoLiftApi = createApi({
  reducerPath: egoLiftRtkConfig.reducerPath,
  baseQuery: fakeBaseQuery(),
  tagTypes: egoLiftRtkConfig.tagTypes,
  endpoints: (build) => ({
    getEgoLiftAlerts: build.query<EgoLiftAlertsResponse, void>({
      queryFn: async () => {
        try {
          const data = await egoLiftApiService.getAlerts();
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "EgoLiftAlerts" as const,
                id,
              })),
              { type: "EgoLiftAlerts" as const, id: "LIST" },
            ]
          : [{ type: "EgoLiftAlerts" as const, id: "LIST" }],
    }),

    getEgoLiftAlertsByExercise: build.query<EgoLiftAlertsResponse, number>({
      queryFn: async (exerciseId) => {
        try {
          const data = await egoLiftApiService.getAlertsByExercise(exerciseId);
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: (_result, _error, exerciseId) => [
        { type: "EgoLiftAlerts" as const, id: `EXERCISE_${exerciseId}` },
        { type: "EgoLiftAlerts" as const, id: "LIST" },
      ],
    }),

    dismissEgoLiftAlert: build.mutation<void, number>({
      queryFn: async (alertId) => {
        try {
          await egoLiftApiService.dismissAlert(alertId);
          return { data: undefined };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: [{ type: "EgoLiftAlerts" as const, id: "LIST" }],
    }),
  }),
});

export const {
  useGetEgoLiftAlertsQuery,
  useGetEgoLiftAlertsByExerciseQuery,
  useDismissEgoLiftAlertMutation,
} = egoLiftApi;
