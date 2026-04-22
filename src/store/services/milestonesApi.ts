import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import { milestonesRtkConfig } from "@/configs/milestonesRtkConfig";
import { milestonesApiService } from "@/views/milestones/services/milestonesApi";
import type {
  MilestonesResponse,
  UserMilestonesResponse,
  CheckMilestonesResponse,
} from "@/views/milestones/types";

export const milestonesApi = createApi({
  reducerPath: milestonesRtkConfig.reducerPath,
  baseQuery: fakeBaseQuery(),
  tagTypes: milestonesRtkConfig.tagTypes,
  endpoints: (build) => ({
    getMilestones: build.query<MilestonesResponse, void>({
      queryFn: async () => {
        try {
          const data = await milestonesApiService.getAllMilestones();
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Milestones" as const,
                id,
              })),
              { type: "Milestones" as const, id: "LIST" },
            ]
          : [{ type: "Milestones" as const, id: "LIST" }],
    }),

    getUserMilestones: build.query<UserMilestonesResponse, void>({
      queryFn: async () => {
        try {
          const data = await milestonesApiService.getUserMilestones();
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "UserMilestones" as const,
                id,
              })),
              { type: "UserMilestones" as const, id: "LIST" },
            ]
          : [{ type: "UserMilestones" as const, id: "LIST" }],
    }),

    checkAndAwardMilestones: build.mutation<CheckMilestonesResponse, void>({
      queryFn: async () => {
        try {
          const data = await milestonesApiService.checkAndAwardMilestones();
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: [
        { type: "UserMilestones" as const, id: "LIST" },
        { type: "Milestones" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetMilestonesQuery,
  useGetUserMilestonesQuery,
  useCheckAndAwardMilestonesMutation,
} = milestonesApi;
