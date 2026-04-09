import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import { workoutLogRtkConfig } from "@/configs/workoutLogRtkConfig";
import { workoutLogApiService } from "@/views/workout-log/services/workoutLogApi";
import type {
  CompleteSessionDto,
  GetSessionsParams,
  LogSetDto,
  SessionsResponse,
  StartSessionDto,
  WorkoutSession,
  WorkoutSet,
} from "@/views/workout-log/types";

export const workoutLogApi = createApi({
  reducerPath: workoutLogRtkConfig.reducerPath,
  baseQuery: fakeBaseQuery(),
  tagTypes: workoutLogRtkConfig.tagTypes,
  endpoints: (build) => ({
    getWorkoutSessions: build.query<SessionsResponse, GetSessionsParams>({
      queryFn: async (params) => {
        try {
          const data = await workoutLogApiService.findAll(params);
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: [{ type: "WorkoutSessions", id: "LIST" }],
    }),

    getWorkoutSession: build.query<WorkoutSession, number>({
      queryFn: async (id) => {
        try {
          const data = await workoutLogApiService.findOne(id);
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: (_result, _error, id) => [{ type: "WorkoutSessions", id }],
    }),

    startWorkoutSession: build.mutation<WorkoutSession, StartSessionDto>({
      queryFn: async (dto) => {
        try {
          const data = await workoutLogApiService.startSession(dto);
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: [{ type: "WorkoutSessions", id: "LIST" }],
    }),

    logWorkoutSet: build.mutation<
      WorkoutSet,
      { sessionId: number; dto: LogSetDto }
    >({
      queryFn: async ({ sessionId, dto }) => {
        try {
          const data = await workoutLogApiService.logSet(sessionId, dto);
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: (_result, _error, { sessionId }) => [
        { type: "WorkoutSessions", id: "LIST" },
        { type: "WorkoutSessions", id: sessionId },
      ],
    }),

    completeWorkoutSession: build.mutation<
      WorkoutSession,
      { sessionId: number; dto: CompleteSessionDto }
    >({
      queryFn: async ({ sessionId, dto }) => {
        try {
          const data = await workoutLogApiService.completeSession(
            sessionId,
            dto,
          );
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: (_result, _error, { sessionId }) => [
        { type: "WorkoutSessions", id: "LIST" },
        { type: "WorkoutSessions", id: sessionId },
      ],
    }),

    deleteWorkoutSession: build.mutation<{ message: string }, number>({
      queryFn: async (id) => {
        try {
          const data = await workoutLogApiService.deleteSession(id);
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: (_result, _error, id) => [
        { type: "WorkoutSessions", id },
        { type: "WorkoutSessions", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetWorkoutSessionsQuery,
  useGetWorkoutSessionQuery,
  useStartWorkoutSessionMutation,
  useLogWorkoutSetMutation,
  useCompleteWorkoutSessionMutation,
  useDeleteWorkoutSessionMutation,
} = workoutLogApi;
