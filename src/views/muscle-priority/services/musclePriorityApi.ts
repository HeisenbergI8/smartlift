import type { MuscleGroup } from "@/views/muscle-groups/types";
import type { UpsertMusclePriorityDto, UserMusclePriority } from "../types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const now = new Date().toISOString();

const mg = (id: number, name: string, bodyRegion: string): MuscleGroup => ({
  id,
  name,
  bodyRegion: bodyRegion as MuscleGroup["bodyRegion"],
  description: null,
  createdAt: now,
  updatedAt: now,
});

const ALL_MUSCLE_GROUPS: Record<number, MuscleGroup> = {
  1: mg(1, "Abs", "core"),
  2: mg(2, "Back", "upper_body"),
  3: mg(3, "Biceps", "upper_body"),
  4: mg(4, "Calves", "lower_body"),
  5: mg(5, "Chest", "upper_body"),
  6: mg(6, "Forearms", "upper_body"),
  7: mg(7, "Glutes", "lower_body"),
  8: mg(8, "Hamstrings", "lower_body"),
  9: mg(9, "Obliques", "core"),
  10: mg(10, "Quadriceps", "lower_body"),
  11: mg(11, "Shoulders", "upper_body"),
  12: mg(12, "Triceps", "upper_body"),
};

let mockPriorities: UserMusclePriority[] = [
  {
    id: 1,
    userId: 1,
    muscleGroupId: 5,
    priorityLevel: "high",
    hasImbalance: false,
    notes: "Main focus this training cycle",
    muscleGroup: ALL_MUSCLE_GROUPS[5],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    userId: 1,
    muscleGroupId: 2,
    priorityLevel: "normal",
    hasImbalance: true,
    notes: "Minor left/right imbalance — add unilateral work",
    muscleGroup: ALL_MUSCLE_GROUPS[2],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    userId: 1,
    muscleGroupId: 8,
    priorityLevel: "low",
    hasImbalance: false,
    notes: null,
    muscleGroup: ALL_MUSCLE_GROUPS[8],
    createdAt: now,
    updatedAt: now,
  },
];

let nextId = 4;

export const musclePriorityApiService = {
  getUserPriorities: async (): Promise<UserMusclePriority[]> => {
    await delay(400);
    return [...mockPriorities].sort((a, b) =>
      a.muscleGroup.name.localeCompare(b.muscleGroup.name),
    );
  },

  upsertPriority: async (
    dto: UpsertMusclePriorityDto,
  ): Promise<UserMusclePriority> => {
    await delay(500);
    const muscleGroup = ALL_MUSCLE_GROUPS[dto.muscleGroupId];
    if (!muscleGroup) throw new Error("Muscle group not found");

    const existing = mockPriorities.find(
      (p) => p.muscleGroupId === dto.muscleGroupId,
    );

    if (existing) {
      const updated: UserMusclePriority = {
        ...existing,
        priorityLevel: dto.priorityLevel ?? existing.priorityLevel,
        hasImbalance: dto.hasImbalance ?? existing.hasImbalance,
        notes: dto.notes !== undefined ? dto.notes : existing.notes,
        updatedAt: new Date().toISOString(),
      };
      mockPriorities = mockPriorities.map((p) =>
        p.muscleGroupId === dto.muscleGroupId ? updated : p,
      );
      return updated;
    }

    const created: UserMusclePriority = {
      id: nextId++,
      userId: 1,
      muscleGroupId: dto.muscleGroupId,
      priorityLevel: dto.priorityLevel ?? "normal",
      hasImbalance: dto.hasImbalance ?? false,
      notes: dto.notes ?? null,
      muscleGroup,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockPriorities.push(created);
    return created;
  },

  deletePriority: async (
    muscleGroupId: number,
  ): Promise<{ message: string }> => {
    await delay(300);
    const index = mockPriorities.findIndex(
      (p) => p.muscleGroupId === muscleGroupId,
    );
    if (index === -1) throw new Error("Muscle priority not found");
    mockPriorities.splice(index, 1);
    return { message: "Muscle priority removed" };
  },
};
