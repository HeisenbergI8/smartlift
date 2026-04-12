import { apiClient } from "@/libs/apiClient";
import type { Equipment, SyncEquipmentDto, UserEquipment } from "../types";

function toArray<T>(res: T[] | { data: T[] }): T[] {
  return Array.isArray(res) ? res : res.data;
}

export const equipmentApiService = {
  getAllEquipment: async (): Promise<Equipment[]> => {
    const res = await apiClient.get<Equipment[] | { data: Equipment[] }>(
      "/equipment",
    );
    return toArray(res);
  },

  getUserEquipment: async (): Promise<UserEquipment[]> => {
    const res = await apiClient.get<
      UserEquipment[] | { data: UserEquipment[] }
    >("/equipment/me");
    return toArray(res);
  },

  syncUserEquipment: async (
    dto: SyncEquipmentDto,
  ): Promise<UserEquipment[]> => {
    const res = await apiClient.put<
      UserEquipment[] | { data: UserEquipment[] }
    >("/equipment/me", dto);
    return toArray(res);
  },
};
