import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import { workoutPlanRtkConfig } from "@/configs/workoutPlanRtkConfig";
import { workoutPlanApiService } from "@/views/workout-plans/services/workoutPlanApi";
import type {
  CreateWorkoutPlanDto,
  GenerateWorkoutPlanDto,
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

    getActivePlan: build.query<WorkoutPlan, void>({
      queryFn: async () => {
        try {
          const data = await workoutPlanApiService.findActive();
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: [{ type: "WorkoutPlans", id: "ACTIVE" }],
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
      invalidatesTags: [
        { type: "WorkoutPlans", id: "LIST" },
        { type: "WorkoutPlans", id: "ACTIVE" },
      ],
    }),

    generateWorkoutPlan: build.mutation<WorkoutPlan, GenerateWorkoutPlanDto>({
      queryFn: async (dto) => {
        try {
          const data = await workoutPlanApiService.generate(dto);
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: [
        { type: "WorkoutPlans", id: "LIST" },
        { type: "WorkoutPlans", id: "ACTIVE" },
      ],
    }),

    deleteWorkoutPlan: build.mutation<void, number>({
      queryFn: async (id) => {
        try {
          await workoutPlanApiService.remove(id);
          return { data: undefined };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: (_result, _error, id) => [
        { type: "WorkoutPlans", id },
        { type: "WorkoutPlans", id: "LIST" },
        { type: "WorkoutPlans", id: "ACTIVE" },
      ],
    }),
  }),
});

export const {
  useGetWorkoutPlansQuery,
  useGetActivePlanQuery,
  useGetWorkoutPlanQuery,
  useCreateWorkoutPlanMutation,
  useUpdateWorkoutPlanMutation,
  useActivateWorkoutPlanMutation,
  useGenerateWorkoutPlanMutation,
  useDeleteWorkoutPlanMutation,
} = workoutPlanApi;
