import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import { workoutPlanRtkConfig } from "@/configs/workoutPlanRtkConfig";
import { workoutPlanApiService } from "@/views/workout-plans/services/workoutPlanApi";
import type {
  CreateWorkoutPlanDto,
  UpdateWorkoutPlanDto,
  WorkoutPlan,
} from "@/views/workout-plans/types";

export const workoutPlanApi = createApi({
  reducerPath: workoutPlanRtkConfig.reducerPath,
  baseQuery: fakeBaseQuery(),
  tagTypes: workoutPlanRtkConfig.tagTypes,
  endpoints: (build) => ({
    getWorkoutPlans: build.query<WorkoutPlan[], void>({
      queryFn: async () => {
        try {
          const data = await workoutPlanApiService.findAll();
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: [{ type: "WorkoutPlans", id: "LIST" }],
    }),

    getWorkoutPlan: build.query<WorkoutPlan, number>({
      queryFn: async (id) => {
        try {
          const data = await workoutPlanApiService.findOne(id);
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: (_result, _error, id) => [{ type: "WorkoutPlans", id }],
    }),

    createWorkoutPlan: build.mutation<WorkoutPlan, CreateWorkoutPlanDto>({
      queryFn: async (dto) => {
        try {
          const data = await workoutPlanApiService.create(dto);
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: [{ type: "WorkoutPlans", id: "LIST" }],
    }),

    updateWorkoutPlan: build.mutation<
      WorkoutPlan,
      { id: number; dto: UpdateWorkoutPlanDto }
    >({
      queryFn: async ({ id, dto }) => {
        try {
          const data = await workoutPlanApiService.update(id, dto);
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "WorkoutPlans", id },
        { type: "WorkoutPlans", id: "LIST" },
      ],
    }),

    activateWorkoutPlan: build.mutation<WorkoutPlan, number>({
      queryFn: async (id) => {
        try {
          const data = await workoutPlanApiService.activate(id);
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: [{ type: "WorkoutPlans", id: "LIST" }],
    }),

    deleteWorkoutPlan: build.mutation<{ message: string }, number>({
      queryFn: async (id) => {
        try {
          const data = await workoutPlanApiService.remove(id);
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: (_result, _error, id) => [
        { type: "WorkoutPlans", id },
        { type: "WorkoutPlans", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetWorkoutPlansQuery,
  useGetWorkoutPlanQuery,
  useCreateWorkoutPlanMutation,
  useUpdateWorkoutPlanMutation,
  useActivateWorkoutPlanMutation,
  useDeleteWorkoutPlanMutation,
} = workoutPlanApi;
