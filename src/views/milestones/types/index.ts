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
  iconUrl: string | null;
  createdAt: string;
};

export type UserMilestone = {
  id: number;
  userId: number;
  milestoneId: number;
  achievedAt: string;
  milestone: Milestone;
};

export type MilestonesResponse = Milestone[];

export type UserMilestonesResponse = UserMilestone[];

export type CheckMilestonesResponse = Milestone[];
