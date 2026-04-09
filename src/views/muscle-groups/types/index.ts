export type BodyRegion = "upper_body" | "lower_body" | "core" | "full_body";

export type MuscleGroup = {
  id: number;
  name: string;
  bodyRegion: BodyRegion;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};
