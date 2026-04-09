import type { Equipment, SyncEquipmentDto, UserEquipment } from "../types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const now = new Date().toISOString();

const mockCatalog: Equipment[] = [
  {
    id: 1,
    name: "Barbell",
    description: "Standard Olympic barbell",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    name: "Dumbbell",
    description: "Adjustable or fixed-weight dumbbells",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    name: "Kettlebell",
    description: "Cast-iron or steel weighted ball with handle",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 4,
    name: "Pull-up Bar",
    description: "Overhead bar for pull-ups and chin-ups",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 5,
    name: "Resistance Bands",
    description: "Elastic bands for assisted or resisted exercises",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 6,
    name: "Cable Machine",
    description: "Adjustable pulley system for cable exercises",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 7,
    name: "Smith Machine",
    description: "Barbell fixed within steel rails for guided movement",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 8,
    name: "Leg Press",
    description: "Machine for pressing weight with the legs",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 9,
    name: "Bench",
    description: "Flat or adjustable bench for pressing movements",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 10,
    name: "Squat Rack",
    description: "Rack for safely performing barbell squats",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 11,
    name: "EZ Bar",
    description: "Curved barbell for bicep and tricep exercises",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 12,
    name: "Trap Bar",
    description: "Hexagonal bar for deadlifts and shrugs",
    createdAt: now,
    updatedAt: now,
  },
];

let mockUserEquipmentIds: number[] = [1, 2, 3];

function buildUserEquipment(ids: number[]): UserEquipment[] {
  return ids
    .map((equipmentId, index) => {
      const equipment = mockCatalog.find((e) => e.id === equipmentId);
      if (!equipment) return null;
      return {
        id: index + 1,
        userId: 1,
        equipmentId,
        equipment,
        createdAt: now,
      };
    })
    .filter((item): item is UserEquipment => item !== null);
}

export const equipmentApiService = {
  getAllEquipment: async (): Promise<Equipment[]> => {
    await delay(500);
    return [...mockCatalog];
  },

  getUserEquipment: async (): Promise<UserEquipment[]> => {
    await delay(400);
    return buildUserEquipment(mockUserEquipmentIds);
  },

  syncUserEquipment: async (
    dto: SyncEquipmentDto,
  ): Promise<UserEquipment[]> => {
    await delay(700);
    mockUserEquipmentIds = [...dto.equipmentIds];
    return buildUserEquipment(mockUserEquipmentIds);
  },
};
