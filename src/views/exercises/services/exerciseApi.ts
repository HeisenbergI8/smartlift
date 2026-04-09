import type {
  Exercise,
  ExercisesResponse,
  FindExercisesParams,
} from "../types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const now = new Date().toISOString();

// Muscle group references (matching muscleGroupApi mock IDs)
const mg = (id: number, name: string, bodyRegion: string) => ({
  id,
  name,
  bodyRegion: bodyRegion as "upper_body" | "lower_body" | "core" | "full_body",
  description: null,
  createdAt: now,
  updatedAt: now,
});

const MG = {
  abs: mg(1, "Abs", "core"),
  back: mg(2, "Back", "upper_body"),
  biceps: mg(3, "Biceps", "upper_body"),
  calves: mg(4, "Calves", "lower_body"),
  chest: mg(5, "Chest", "upper_body"),
  forearms: mg(6, "Forearms", "upper_body"),
  glutes: mg(7, "Glutes", "lower_body"),
  hamstrings: mg(8, "Hamstrings", "lower_body"),
  obliques: mg(9, "Obliques", "core"),
  quads: mg(10, "Quadriceps", "lower_body"),
  shoulders: mg(11, "Shoulders", "upper_body"),
  triceps: mg(12, "Triceps", "upper_body"),
};

// Equipment references (matching equipmentApi mock IDs)
const eq = (id: number, name: string) => ({
  id,
  name,
  description: null,
  createdAt: now,
  updatedAt: now,
});

const EQ = {
  barbell: eq(1, "Barbell"),
  dumbbell: eq(2, "Dumbbell"),
  kettlebell: eq(3, "Kettlebell"),
  pullUpBar: eq(4, "Pull-up Bar"),
  resistanceBands: eq(5, "Resistance Bands"),
  cableMachine: eq(6, "Cable Machine"),
  smithMachine: eq(7, "Smith Machine"),
  legPress: eq(8, "Leg Press"),
  bench: eq(9, "Bench"),
  squat: eq(10, "Squat Rack"),
  ezBar: eq(11, "EZ Bar"),
  trapBar: eq(12, "Trap Bar"),
};

let nextEmId = 1;
const emLink = (
  exerciseId: number,
  muscleGroupId: number,
  muscleGroup: typeof MG.abs,
) => ({
  id: nextEmId++,
  exerciseId,
  muscleGroupId,
  muscleGroup,
});

let nextEeId = 1;
const eeLink = (
  exerciseId: number,
  equipmentId: number,
  equipment: typeof EQ.barbell,
) => ({
  id: nextEeId++,
  exerciseId,
  equipmentId,
  equipment,
});

const mockExercises: Exercise[] = [
  {
    id: 1,
    name: "Barbell Bench Press",
    description:
      "Lie on a flat bench and press the barbell upward from chest level to full arm extension.",
    category: "compound",
    difficulty: "intermediate",
    createdAt: now,
    updatedAt: now,
    exerciseMuscles: [
      emLink(1, 5, MG.chest),
      emLink(1, 11, MG.shoulders),
      emLink(1, 12, MG.triceps),
    ],
    exerciseEquipment: [eeLink(1, 1, EQ.barbell), eeLink(1, 9, EQ.bench)],
  },
  {
    id: 2,
    name: "Barbell Back Squat",
    description:
      "Place a barbell on your upper back, squat down until thighs are parallel, then drive up.",
    category: "compound",
    difficulty: "intermediate",
    createdAt: now,
    updatedAt: now,
    exerciseMuscles: [
      emLink(2, 10, MG.quads),
      emLink(2, 7, MG.glutes),
      emLink(2, 8, MG.hamstrings),
    ],
    exerciseEquipment: [eeLink(2, 1, EQ.barbell), eeLink(2, 10, EQ.squat)],
  },
  {
    id: 3,
    name: "Conventional Deadlift",
    description:
      "Lift a barbell from the floor to hip level by extending hips and knees.",
    category: "compound",
    difficulty: "advanced",
    createdAt: now,
    updatedAt: now,
    exerciseMuscles: [
      emLink(3, 2, MG.back),
      emLink(3, 7, MG.glutes),
      emLink(3, 8, MG.hamstrings),
      emLink(3, 6, MG.forearms),
    ],
    exerciseEquipment: [eeLink(3, 1, EQ.barbell)],
  },
  {
    id: 4,
    name: "Overhead Press",
    description:
      "Press a barbell from shoulder height to overhead while standing.",
    category: "compound",
    difficulty: "intermediate",
    createdAt: now,
    updatedAt: now,
    exerciseMuscles: [emLink(4, 11, MG.shoulders), emLink(4, 12, MG.triceps)],
    exerciseEquipment: [eeLink(4, 1, EQ.barbell)],
  },
  {
    id: 5,
    name: "Pull-up",
    description:
      "Hang from a bar and pull your body up until chin clears the bar.",
    category: "bodyweight",
    difficulty: "intermediate",
    createdAt: now,
    updatedAt: now,
    exerciseMuscles: [
      emLink(5, 2, MG.back),
      emLink(5, 3, MG.biceps),
      emLink(5, 6, MG.forearms),
    ],
    exerciseEquipment: [eeLink(5, 4, EQ.pullUpBar)],
  },
  {
    id: 6,
    name: "Dumbbell Bicep Curl",
    description:
      "Curl dumbbells from arm's length to shoulder height, keeping elbows stationary.",
    category: "isolation",
    difficulty: "beginner",
    createdAt: now,
    updatedAt: now,
    exerciseMuscles: [emLink(6, 3, MG.biceps), emLink(6, 6, MG.forearms)],
    exerciseEquipment: [eeLink(6, 2, EQ.dumbbell)],
  },
  {
    id: 7,
    name: "Tricep Pushdown",
    description: "Push a cable attachment downward by extending the elbows.",
    category: "isolation",
    difficulty: "beginner",
    createdAt: now,
    updatedAt: now,
    exerciseMuscles: [emLink(7, 12, MG.triceps)],
    exerciseEquipment: [eeLink(7, 6, EQ.cableMachine)],
  },
  {
    id: 8,
    name: "Leg Press",
    description:
      "Push a weighted platform away using your legs on a leg press machine.",
    category: "compound",
    difficulty: "beginner",
    createdAt: now,
    updatedAt: now,
    exerciseMuscles: [emLink(8, 10, MG.quads), emLink(8, 7, MG.glutes)],
    exerciseEquipment: [eeLink(8, 8, EQ.legPress)],
  },
  {
    id: 9,
    name: "Romanian Deadlift",
    description:
      "Lower a barbell by hinging at the hips with a slight knee bend, then return to standing.",
    category: "compound",
    difficulty: "intermediate",
    createdAt: now,
    updatedAt: now,
    exerciseMuscles: [
      emLink(9, 8, MG.hamstrings),
      emLink(9, 7, MG.glutes),
      emLink(9, 2, MG.back),
    ],
    exerciseEquipment: [eeLink(9, 1, EQ.barbell)],
  },
  {
    id: 10,
    name: "Lat Pulldown",
    description: "Pull a wide bar down to chest level on a cable machine.",
    category: "compound",
    difficulty: "beginner",
    createdAt: now,
    updatedAt: now,
    exerciseMuscles: [emLink(10, 2, MG.back), emLink(10, 3, MG.biceps)],
    exerciseEquipment: [eeLink(10, 6, EQ.cableMachine)],
  },
  {
    id: 11,
    name: "Dumbbell Lateral Raise",
    description:
      "Raise dumbbells out to the sides until arms are parallel to the floor.",
    category: "isolation",
    difficulty: "beginner",
    createdAt: now,
    updatedAt: now,
    exerciseMuscles: [emLink(11, 11, MG.shoulders)],
    exerciseEquipment: [eeLink(11, 2, EQ.dumbbell)],
  },
  {
    id: 12,
    name: "Cable Fly",
    description:
      "Bring cable handles together in a hugging motion to target the chest.",
    category: "isolation",
    difficulty: "intermediate",
    createdAt: now,
    updatedAt: now,
    exerciseMuscles: [emLink(12, 5, MG.chest)],
    exerciseEquipment: [eeLink(12, 6, EQ.cableMachine)],
  },
  {
    id: 13,
    name: "Plank",
    description:
      "Hold a push-up position with body in a straight line from head to heels.",
    category: "bodyweight",
    difficulty: "beginner",
    createdAt: now,
    updatedAt: now,
    exerciseMuscles: [emLink(13, 1, MG.abs), emLink(13, 9, MG.obliques)],
    exerciseEquipment: [],
  },
  {
    id: 14,
    name: "Kettlebell Swing",
    description:
      "Swing a kettlebell from between the legs to chest height using hip drive.",
    category: "compound",
    difficulty: "intermediate",
    createdAt: now,
    updatedAt: now,
    exerciseMuscles: [
      emLink(14, 7, MG.glutes),
      emLink(14, 8, MG.hamstrings),
      emLink(14, 1, MG.abs),
    ],
    exerciseEquipment: [eeLink(14, 3, EQ.kettlebell)],
  },
  {
    id: 15,
    name: "EZ Bar Curl",
    description: "Curl an EZ bar from arm's length to shoulder height.",
    category: "isolation",
    difficulty: "beginner",
    createdAt: now,
    updatedAt: now,
    exerciseMuscles: [emLink(15, 3, MG.biceps), emLink(15, 6, MG.forearms)],
    exerciseEquipment: [eeLink(15, 11, EQ.ezBar)],
  },
  {
    id: 16,
    name: "Standing Calf Raise",
    description:
      "Rise up on your toes from a standing position to target the calves.",
    category: "isolation",
    difficulty: "beginner",
    createdAt: now,
    updatedAt: now,
    exerciseMuscles: [emLink(16, 4, MG.calves)],
    exerciseEquipment: [eeLink(16, 7, EQ.smithMachine)],
  },
  {
    id: 17,
    name: "Trap Bar Deadlift",
    description:
      "Lift a trap bar from the floor to hip level, standing inside the bar.",
    category: "compound",
    difficulty: "intermediate",
    createdAt: now,
    updatedAt: now,
    exerciseMuscles: [
      emLink(17, 10, MG.quads),
      emLink(17, 7, MG.glutes),
      emLink(17, 2, MG.back),
    ],
    exerciseEquipment: [eeLink(17, 12, EQ.trapBar)],
  },
  {
    id: 18,
    name: "Push-up",
    description:
      "Lower your body to the ground and press back up using your arms.",
    category: "bodyweight",
    difficulty: "beginner",
    createdAt: now,
    updatedAt: now,
    exerciseMuscles: [
      emLink(18, 5, MG.chest),
      emLink(18, 12, MG.triceps),
      emLink(18, 11, MG.shoulders),
    ],
    exerciseEquipment: [],
  },
  {
    id: 19,
    name: "Banded Pull-apart",
    description:
      "Pull a resistance band apart horizontally to target rear deltoids.",
    category: "isolation",
    difficulty: "beginner",
    createdAt: now,
    updatedAt: now,
    exerciseMuscles: [emLink(19, 11, MG.shoulders), emLink(19, 2, MG.back)],
    exerciseEquipment: [eeLink(19, 5, EQ.resistanceBands)],
  },
  {
    id: 20,
    name: "Incline Dumbbell Press",
    description: "Press dumbbells upward while lying on an incline bench.",
    category: "compound",
    difficulty: "intermediate",
    createdAt: now,
    updatedAt: now,
    exerciseMuscles: [
      emLink(20, 5, MG.chest),
      emLink(20, 11, MG.shoulders),
      emLink(20, 12, MG.triceps),
    ],
    exerciseEquipment: [eeLink(20, 2, EQ.dumbbell), eeLink(20, 9, EQ.bench)],
  },
];

export const exerciseApiService = {
  getExercises: async (
    params: FindExercisesParams,
  ): Promise<ExercisesResponse> => {
    await delay(500);

    let filtered = [...mockExercises];

    if (params.search) {
      const term = params.search.toLowerCase();
      filtered = filtered.filter((e) => e.name.toLowerCase().includes(term));
    }

    if (params.category) {
      filtered = filtered.filter((e) => e.category === params.category);
    }

    if (params.difficulty) {
      filtered = filtered.filter((e) => e.difficulty === params.difficulty);
    }

    if (params.muscleGroupId) {
      filtered = filtered.filter((e) =>
        e.exerciseMuscles.some(
          (em) => em.muscleGroupId === params.muscleGroupId,
        ),
      );
    }

    if (params.equipmentId) {
      filtered = filtered.filter((e) =>
        e.exerciseEquipment.some((ee) => ee.equipmentId === params.equipmentId),
      );
    }

    const total = filtered.length;
    const start = (params.page - 1) * params.limit;
    const data = filtered.slice(start, start + params.limit);

    return { data, total, page: params.page, limit: params.limit };
  },

  getExercise: async (id: number): Promise<Exercise> => {
    await delay(300);
    const exercise = mockExercises.find((e) => e.id === id);
    if (!exercise) {
      throw new Error("Exercise not found");
    }
    return { ...exercise };
  },
};
