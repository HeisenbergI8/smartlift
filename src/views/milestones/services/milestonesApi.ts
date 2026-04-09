import type {
  Milestone,
  MilestonesResponse,
  UserMilestone,
  UserMilestonesResponse,
  CheckMilestonesResponse,
} from "../types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const daysAgo = (d: number) =>
  new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString();

const mockMilestones: Milestone[] = [
  // Strength
  {
    id: 1,
    name: "Beginner Strength",
    description: "Hit a 100 kg personal record on any exercise.",
    category: "strength",
    targetValue: 100,
    unit: "kg",
  },
  {
    id: 2,
    name: "Intermediate Strength",
    description: "Hit a 140 kg personal record on any exercise.",
    category: "strength",
    targetValue: 140,
    unit: "kg",
  },
  {
    id: 3,
    name: "Elite Strength",
    description: "Hit a 200 kg personal record on any exercise.",
    category: "strength",
    targetValue: 200,
    unit: "kg",
  },
  // Consistency
  {
    id: 4,
    name: "First Session",
    description: "Complete your very first workout session.",
    category: "consistency",
    targetValue: 1,
    unit: "sessions",
  },
  {
    id: 5,
    name: "10 Sessions",
    description: "Complete 10 workout sessions.",
    category: "consistency",
    targetValue: 10,
    unit: "sessions",
  },
  {
    id: 6,
    name: "50 Sessions",
    description: "Complete 50 workout sessions.",
    category: "consistency",
    targetValue: 50,
    unit: "sessions",
  },
  {
    id: 7,
    name: "Century Club",
    description: "Complete 100 workout sessions.",
    category: "consistency",
    targetValue: 100,
    unit: "sessions",
  },
  // Weight
  {
    id: 8,
    name: "First 2 kg Lost",
    description: "Lose your first 2 kg from your starting weight.",
    category: "weight",
    targetValue: 2,
    unit: "kg lost",
  },
  {
    id: 9,
    name: "5 kg Down",
    description: "Lose 5 kg from your starting weight.",
    category: "weight",
    targetValue: 5,
    unit: "kg lost",
  },
  {
    id: 10,
    name: "10 kg Transformation",
    description: "Lose 10 kg from your starting weight.",
    category: "weight",
    targetValue: 10,
    unit: "kg lost",
  },
  // Nutrition
  {
    id: 11,
    name: "First Nutrition Log",
    description: "Log your first nutrition entry.",
    category: "nutrition",
    targetValue: 1,
    unit: "logs",
  },
  // General
  {
    id: 12,
    name: "Welcome to SmartLift",
    description: "Create your SmartLift account and complete your profile.",
    category: "general",
    targetValue: 1,
    unit: "profile",
  },
];

const earnedMilestoneIds = new Set([1, 4, 8, 12]);

const mockUserMilestones: UserMilestone[] = [
  {
    id: 1,
    userId: 1,
    milestoneId: 12,
    earnedAt: daysAgo(60),
    milestone: mockMilestones.find((m) => m.id === 12)!,
  },
  {
    id: 2,
    userId: 1,
    milestoneId: 4,
    earnedAt: daysAgo(45),
    milestone: mockMilestones.find((m) => m.id === 4)!,
  },
  {
    id: 3,
    userId: 1,
    milestoneId: 8,
    earnedAt: daysAgo(20),
    milestone: mockMilestones.find((m) => m.id === 8)!,
  },
  {
    id: 4,
    userId: 1,
    milestoneId: 1,
    earnedAt: daysAgo(7),
    milestone: mockMilestones.find((m) => m.id === 1)!,
  },
];

// Simulates the newly awarded milestone from checkAndAwardMilestones
let checkCalled = false;

export const milestonesApiService = {
  async getAllMilestones(): Promise<MilestonesResponse> {
    await delay(300);
    return { data: mockMilestones };
  },

  async getUserMilestones(): Promise<UserMilestonesResponse> {
    await delay(250);
    const earned = checkCalled
      ? [
          ...mockUserMilestones,
          {
            id: 5,
            userId: 1,
            milestoneId: 5,
            earnedAt: new Date().toISOString(),
            milestone: mockMilestones.find((m) => m.id === 5)!,
          },
        ]
      : mockUserMilestones;
    return { data: earned };
  },

  async checkAndAwardMilestones(): Promise<CheckMilestonesResponse> {
    await delay(500);
    if (checkCalled) {
      return { data: [] };
    }
    checkCalled = true;
    earnedMilestoneIds.add(5);
    return {
      data: [
        {
          id: 5,
          userId: 1,
          milestoneId: 5,
          earnedAt: new Date().toISOString(),
          milestone: mockMilestones.find((m) => m.id === 5)!,
        },
      ],
    };
  },

  getEarnedMilestoneIds(): Set<number> {
    return earnedMilestoneIds;
  },
};
