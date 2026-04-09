import type { BodyRegion, MuscleGroup } from "../types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const now = new Date().toISOString();

const mockMuscleGroups: MuscleGroup[] = [
  {
    id: 1,
    name: "Abs",
    bodyRegion: "core",
    description: "Rectus abdominis and transverse abdominis",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    name: "Back",
    bodyRegion: "upper_body",
    description: "Latissimus dorsi, rhomboids, and erector spinae",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    name: "Biceps",
    bodyRegion: "upper_body",
    description: "Biceps brachii — long and short head",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 4,
    name: "Calves",
    bodyRegion: "lower_body",
    description: "Gastrocnemius and soleus",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 5,
    name: "Chest",
    bodyRegion: "upper_body",
    description: "Pectoralis major and minor",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 6,
    name: "Forearms",
    bodyRegion: "upper_body",
    description: "Wrist flexors and extensors",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 7,
    name: "Glutes",
    bodyRegion: "lower_body",
    description: "Gluteus maximus, medius, and minimus",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 8,
    name: "Hamstrings",
    bodyRegion: "lower_body",
    description: "Biceps femoris, semitendinosus, semimembranosus",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 9,
    name: "Obliques",
    bodyRegion: "core",
    description: "Internal and external obliques",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 10,
    name: "Quadriceps",
    bodyRegion: "lower_body",
    description: "Rectus femoris, vastus lateralis, medialis, and intermedius",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 11,
    name: "Shoulders",
    bodyRegion: "upper_body",
    description: "Anterior, lateral, and posterior deltoids",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 12,
    name: "Triceps",
    bodyRegion: "upper_body",
    description: "Triceps brachii — long, lateral, and medial head",
    createdAt: now,
    updatedAt: now,
  },
];

export const muscleGroupApiService = {
  getAll: async (): Promise<MuscleGroup[]> => {
    await delay(400);
    return [...mockMuscleGroups].sort((a, b) => a.name.localeCompare(b.name));
  },

  getByRegion: async (bodyRegion: BodyRegion): Promise<MuscleGroup[]> => {
    await delay(300);
    return mockMuscleGroups
      .filter((mg) => mg.bodyRegion === bodyRegion)
      .sort((a, b) => a.name.localeCompare(b.name));
  },
};
