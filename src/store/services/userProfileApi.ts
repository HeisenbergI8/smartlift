import { createApi } from "@reduxjs/toolkit/query/react";

import { userProfileRtkConfig } from "@/configs/userProfileRtkConfig";
import { userProfileApiService } from "@/views/user-profile/services/userProfileApi";

import type { UpdateProfileDto, UserProfile } from "@/views/user-profile/types";

export const userProfileApi = createApi({
  ...userProfileRtkConfig,
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfile, void>({
      queryFn: async () => {
        try {
          const data = await userProfileApiService.getProfile();
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: ["UserProfile"],
    }),
    upsertProfile: builder.mutation<UserProfile, UpdateProfileDto>({
      queryFn: async (dto) => {
        try {
          const data = await userProfileApiService.upsertProfile(dto);
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: ["UserProfile"],
    }),
  }),
});

export const { useGetProfileQuery, useUpsertProfileMutation } = userProfileApi;
