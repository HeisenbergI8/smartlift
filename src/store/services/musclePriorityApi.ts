import { createApi } from "@reduxjs/toolkit/query/react";

import { musclePriorityRtkConfig } from "@/configs/musclePriorityRtkConfig";
import { musclePriorityApiService } from "@/views/muscle-priority/services/musclePriorityApi";

import type {
  UpsertMusclePriorityDto,
  UserMusclePriority,
} from "@/views/muscle-priority/types";

export const musclePriorityApi = createApi({
  ...musclePriorityRtkConfig,
  endpoints: (builder) => ({
    getUserPriorities: builder.query<UserMusclePriority[], void>({
      queryFn: async () => {
        try {
          const data = await musclePriorityApiService.getUserPriorities();
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ muscleGroupId }) => ({
                type: "MusclePriorities" as const,
                id: muscleGroupId,
              })),
              { type: "MusclePriorities", id: "LIST" },
            ]
          : [{ type: "MusclePriorities", id: "LIST" }],
    }),

    upsertPriority: builder.mutation<
      UserMusclePriority,
      UpsertMusclePriorityDto
    >({
      queryFn: async (dto) => {
        try {
          const data = await musclePriorityApiService.upsertPriority(dto);
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: [{ type: "MusclePriorities", id: "LIST" }],
    }),

    deletePriority: builder.mutation<{ message: string }, number>({
      queryFn: async (muscleGroupId) => {
        try {
          const data =
            await musclePriorityApiService.deletePriority(muscleGroupId);
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: (_result, _error, muscleGroupId) => [
        { type: "MusclePriorities", id: muscleGroupId },
        { type: "MusclePriorities", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetUserPrioritiesQuery,
  useUpsertPriorityMutation,
  useDeletePriorityMutation,
} = musclePriorityApi;
