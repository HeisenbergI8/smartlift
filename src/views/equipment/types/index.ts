export type Equipment = {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UserEquipment = {
  id: number;
  userId: number;
  equipmentId: number;
  equipment: Equipment;
  createdAt: string;
};

export type SyncEquipmentDto = {
  equipmentIds: number[];
};
