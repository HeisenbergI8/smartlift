import { createApi } from "@reduxjs/toolkit/query/react";

import { exerciseRtkConfig } from "@/configs/exerciseRtkConfig";
import { exerciseApiService } from "@/views/exercises/services/exerciseApi";

import type {
  Exercise,
  ExercisesResponse,
  FindExercisesParams,
} from "@/views/exercises/types";

export const exerciseApi = createApi({
  ...exerciseRtkConfig,
  endpoints: (builder) => ({
    getExercises: builder.query<ExercisesResponse, FindExercisesParams>({
      queryFn: async (params) => {
        try {
          const data = await exerciseApiService.getExercises(params);
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Exercises" as const,
                id,
              })),
              { type: "Exercises", id: "LIST" },
            ]
          : [{ type: "Exercises", id: "LIST" }],
    }),
    getExercise: builder.query<Exercise, number>({
      queryFn: async (id) => {
        try {
          const data = await exerciseApiService.getExercise(id);
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: (_result, _error, id) => [{ type: "Exercises", id }],
    }),
  }),
});

export const { useGetExercisesQuery, useGetExerciseQuery } = exerciseApi;
