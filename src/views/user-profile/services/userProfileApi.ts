import type { UpdateProfileDto, UserProfile } from "../types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockProfile: UserProfile = {
  id: 1,
  userId: 1,
  heightCm: 175,
  weightKg: 80,
  age: 25,
  gender: "male",
  fitnessGoal: "build_muscle",
  activityLevel: "moderately_active",
  trainingMethod: "mixed",
  trainingDaysPerWeek: 4,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const userProfileApiService = {
  getProfile: async (): Promise<UserProfile> => {
    await delay(600);
    return { ...mockProfile };
  },

  upsertProfile: async (dto: UpdateProfileDto): Promise<UserProfile> => {
    await delay(800);
    Object.assign(mockProfile, dto, { updatedAt: new Date().toISOString() });
    return { ...mockProfile };
  },
};
