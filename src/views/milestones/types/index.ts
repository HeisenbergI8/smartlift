export type MilestoneCategory =
  | "strength"
  | "consistency"
  | "weight"
  | "nutrition"
  | "general";

export type Milestone = {
  id: number;
  name: string;
  description: string;
  category: MilestoneCategory;
  targetValue: number;
  unit: string;
};

export type UserMilestone = {
  id: number;
  userId: number;
  milestoneId: number;
  earnedAt: string;
  milestone: Milestone;
};

export type MilestonesResponse = {
  data: Milestone[];
};

export type UserMilestonesResponse = {
  data: UserMilestone[];
};

export type CheckMilestonesResponse = {
  data: UserMilestone[];
};
