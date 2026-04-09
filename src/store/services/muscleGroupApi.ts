import { createApi } from "@reduxjs/toolkit/query/react";

import { muscleGroupRtkConfig } from "@/configs/muscleGroupRtkConfig";
import { muscleGroupApiService } from "@/views/muscle-groups/services/muscleGroupApi";

import type { BodyRegion, MuscleGroup } from "@/views/muscle-groups/types";

export const muscleGroupApi = createApi({
  ...muscleGroupRtkConfig,
  endpoints: (builder) => ({
    getMuscleGroups: builder.query<MuscleGroup[], BodyRegion | void>({
      queryFn: async (bodyRegion) => {
        try {
          const data = bodyRegion
            ? await muscleGroupApiService.getByRegion(bodyRegion)
            : await muscleGroupApiService.getAll();
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: ["MuscleGroups"],
    }),
  }),
});

export const { useGetMuscleGroupsQuery } = muscleGroupApi;
