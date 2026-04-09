import { createApi } from "@reduxjs/toolkit/query/react";

import { equipmentRtkConfig } from "@/configs/equipmentRtkConfig";
import { equipmentApiService } from "@/views/equipment/services/equipmentApi";

import type {
  Equipment,
  SyncEquipmentDto,
  UserEquipment,
} from "@/views/equipment/types";

export const equipmentApi = createApi({
  ...equipmentRtkConfig,
  endpoints: (builder) => ({
    getAllEquipment: builder.query<Equipment[], void>({
      queryFn: async () => {
        try {
          const data = await equipmentApiService.getAllEquipment();
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: ["Equipment"],
    }),
    getUserEquipment: builder.query<UserEquipment[], void>({
      queryFn: async () => {
        try {
          const data = await equipmentApiService.getUserEquipment();
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: ["UserEquipment"],
    }),
    syncUserEquipment: builder.mutation<UserEquipment[], SyncEquipmentDto>({
      queryFn: async (dto) => {
        try {
          const data = await equipmentApiService.syncUserEquipment(dto);
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: ["UserEquipment"],
    }),
  }),
});

export const {
  useGetAllEquipmentQuery,
  useGetUserEquipmentQuery,
  useSyncUserEquipmentMutation,
} = equipmentApi;
