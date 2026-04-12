import type {
  CreateWorkoutPlanDto,
  UpdateWorkoutPlanDto,
  WorkoutPlan,
} from "../types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const now = new Date().toISOString();

// Minimal exercise stubs that match mock exercise IDs from exerciseApi.ts
const ex = (id: number, name: string) => ({
  id,
  name,
  description: null,
  category: "compound" as const,
  difficulty: "intermediate" as const,
  isBodyweight: false,
  createdAt: now,
  updatedAt: now,
  exerciseMuscles: [],
  exerciseEquipment: [],
});

const EXERCISES = {
  benchPress: ex(1, "Barbell Bench Press"),
  squat: ex(2, "Barbell Back Squat"),
  deadlift: ex(3, "Conventional Deadlift"),
  ohp: ex(4, "Overhead Press"),
  pullUp: ex(5, "Pull-up"),
  curl: ex(6, "Dumbbell Bicep Curl"),
  tricepPushdown: ex(7, "Tricep Pushdown"),
  legPress: ex(8, "Leg Press"),
  rdl: ex(9, "Romanian Deadlift"),
  latPulldown: ex(10, "Lat Pulldown"),
  lateralRaise: ex(11, "Dumbbell Lateral Raise"),
  cableFly: ex(12, "Cable Fly"),
  plank: ex(13, "Plank"),
  kettlebellSwing: ex(14, "Kettlebell Swing"),
};

let mockPlans: WorkoutPlan[] = [
  {
    id: 1,
    userId: 1,
    name: "Strength Focus — 4 Day",
    description:
      "Upper/lower split focused on progressive overload with the big 3 lifts.",
    trainingGoal: "strength",
    daysPerWeek: 4,
    durationWeeks: 12,
    startedAt: now,
    isActive: true,
    source: "user",
    createdAt: now,
    updatedAt: now,
    workoutPlanDays: [
      {
        id: 1,
        planId: 1,
        dayNumber: 1,
        name: "Upper A",
        isRestDay: false,
        workoutPlanExercises: [
          {
            id: 1,
            dayId: 1,
            exerciseId: 1,
            sortOrder: 1,
            targetSets: 5,
            targetRepsMin: 3,
            targetRepsMax: 5,
            targetWeightKg: 100,
            targetRpe: 8,
            restSeconds: 180,
            notes: "Competition-style pause at bottom",
            exercise: EXERCISES.benchPress,
          },
          {
            id: 2,
            dayId: 1,
            exerciseId: 4,
            sortOrder: 2,
            targetSets: 4,
            targetRepsMin: 5,
            targetRepsMax: 6,
            targetWeightKg: 65,
            targetRpe: 8,
            restSeconds: 150,
            notes: null,
            exercise: EXERCISES.ohp,
          },
          {
            id: 3,
            dayId: 1,
            exerciseId: 10,
            sortOrder: 3,
            targetSets: 4,
            targetRepsMin: 8,
            targetRepsMax: 10,
            targetWeightKg: null,
            targetRpe: 7,
            restSeconds: 90,
            notes: null,
            exercise: EXERCISES.latPulldown,
          },
        ],
      },
      {
        id: 2,
        planId: 1,
        dayNumber: 2,
        name: "Lower A",
        isRestDay: false,
        workoutPlanExercises: [
          {
            id: 4,
            dayId: 2,
            exerciseId: 2,
            sortOrder: 1,
            targetSets: 5,
            targetRepsMin: 3,
            targetRepsMax: 5,
            targetWeightKg: 140,
            targetRpe: 8,
            restSeconds: 240,
            notes: "Belt above 80% of working weight",
            exercise: EXERCISES.squat,
          },
          {
            id: 5,
            dayId: 2,
            exerciseId: 9,
            sortOrder: 2,
            targetSets: 3,
            targetRepsMin: 8,
            targetRepsMax: 10,
            targetWeightKg: 80,
            targetRpe: 7,
            restSeconds: 120,
            notes: null,
            exercise: EXERCISES.rdl,
          },
          {
            id: 6,
            dayId: 2,
            exerciseId: 8,
            sortOrder: 3,
            targetSets: 3,
            targetRepsMin: 10,
            targetRepsMax: 12,
            targetWeightKg: null,
            targetRpe: 7,
            restSeconds: 90,
            notes: null,
            exercise: EXERCISES.legPress,
          },
        ],
      },
      {
        id: 3,
        planId: 1,
        dayNumber: 3,
        name: "Rest",
        isRestDay: true,
        workoutPlanExercises: [],
      },
      {
        id: 4,
        planId: 1,
        dayNumber: 4,
        name: "Upper B",
        isRestDay: false,
        workoutPlanExercises: [
          {
            id: 7,
            dayId: 4,
            exerciseId: 1,
            sortOrder: 1,
            targetSets: 4,
            targetRepsMin: 6,
            targetRepsMax: 8,
            targetWeightKg: 90,
            targetRpe: 7,
            restSeconds: 150,
            notes: null,
            exercise: EXERCISES.benchPress,
          },
          {
            id: 8,
            dayId: 4,
            exerciseId: 5,
            sortOrder: 2,
            targetSets: 4,
            targetRepsMin: 6,
            targetRepsMax: 8,
            targetWeightKg: null,
            targetRpe: 8,
            restSeconds: 120,
            notes: null,
            exercise: EXERCISES.pullUp,
          },
          {
            id: 9,
            dayId: 4,
            exerciseId: 6,
            sortOrder: 3,
            targetSets: 3,
            targetRepsMin: 10,
            targetRepsMax: 12,
            targetWeightKg: 16,
            targetRpe: 7,
            restSeconds: 90,
            notes: null,
            exercise: EXERCISES.curl,
          },
          {
            id: 10,
            dayId: 4,
            exerciseId: 7,
            sortOrder: 4,
            targetSets: 3,
            targetRepsMin: 12,
            targetRepsMax: 15,
            targetWeightKg: null,
            targetRpe: 7,
            restSeconds: 90,
            notes: null,
            exercise: EXERCISES.tricepPushdown,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    userId: 1,
    name: "Hypertrophy Builder — 3 Day",
    description:
      "Full-body training 3 days per week with moderate rep ranges for muscle growth.",
    trainingGoal: "hypertrophy",
    daysPerWeek: 3,
    durationWeeks: 8,
    startedAt: null,
    isActive: false,
    source: "user",
    createdAt: now,
    updatedAt: now,
    workoutPlanDays: [
      {
        id: 5,
        planId: 2,
        dayNumber: 1,
        name: "Full Body A",
        isRestDay: false,
        workoutPlanExercises: [
          {
            id: 11,
            dayId: 5,
            exerciseId: 2,
            sortOrder: 1,
            targetSets: 4,
            targetRepsMin: 8,
            targetRepsMax: 12,
            targetWeightKg: 100,
            targetRpe: 8,
            restSeconds: 120,
            notes: null,
            exercise: EXERCISES.squat,
          },
          {
            id: 12,
            dayId: 5,
            exerciseId: 1,
            sortOrder: 2,
            targetSets: 4,
            targetRepsMin: 8,
            targetRepsMax: 12,
            targetWeightKg: 80,
            targetRpe: 8,
            restSeconds: 120,
            notes: null,
            exercise: EXERCISES.benchPress,
          },
          {
            id: 13,
            dayId: 5,
            exerciseId: 10,
            sortOrder: 3,
            targetSets: 3,
            targetRepsMin: 10,
            targetRepsMax: 15,
            targetWeightKg: null,
            targetRpe: 7,
            restSeconds: 90,
            notes: null,
            exercise: EXERCISES.latPulldown,
          },
          {
            id: 14,
            dayId: 5,
            exerciseId: 11,
            sortOrder: 4,
            targetSets: 3,
            targetRepsMin: 15,
            targetRepsMax: 20,
            targetWeightKg: 8,
            targetRpe: 7,
            restSeconds: 60,
            notes: null,
            exercise: EXERCISES.lateralRaise,
          },
        ],
      },
      {
        id: 6,
        planId: 2,
        dayNumber: 2,
        name: "Full Body B",
        isRestDay: false,
        workoutPlanExercises: [
          {
            id: 15,
            dayId: 6,
            exerciseId: 3,
            sortOrder: 1,
            targetSets: 4,
            targetRepsMin: 6,
            targetRepsMax: 8,
            targetWeightKg: 120,
            targetRpe: 8,
            restSeconds: 180,
            notes: null,
            exercise: EXERCISES.deadlift,
          },
          {
            id: 16,
            dayId: 6,
            exerciseId: 4,
            sortOrder: 2,
            targetSets: 3,
            targetRepsMin: 10,
            targetRepsMax: 12,
            targetWeightKg: 50,
            targetRpe: 7,
            restSeconds: 90,
            notes: null,
            exercise: EXERCISES.ohp,
          },
          {
            id: 17,
            dayId: 6,
            exerciseId: 5,
            sortOrder: 3,
            targetSets: 3,
            targetRepsMin: 8,
            targetRepsMax: 10,
            targetWeightKg: null,
            targetRpe: 8,
            restSeconds: 90,
            notes: null,
            exercise: EXERCISES.pullUp,
          },
          {
            id: 18,
            dayId: 6,
            exerciseId: 13,
            sortOrder: 4,
            targetSets: 3,
            targetRepsMin: 30,
            targetRepsMax: 60,
            targetWeightKg: null,
            targetRpe: null,
            restSeconds: 60,
            notes: "Hold for 30–60 seconds",
            exercise: EXERCISES.plank,
          },
        ],
      },
      {
        id: 7,
        planId: 2,
        dayNumber: 3,
        name: "Full Body C",
        isRestDay: false,
        workoutPlanExercises: [
          {
            id: 19,
            dayId: 7,
            exerciseId: 14,
            sortOrder: 1,
            targetSets: 4,
            targetRepsMin: 12,
            targetRepsMax: 15,
            targetWeightKg: 24,
            targetRpe: 7,
            restSeconds: 60,
            notes: null,
            exercise: EXERCISES.kettlebellSwing,
          },
          {
            id: 20,
            dayId: 7,
            exerciseId: 12,
            sortOrder: 2,
            targetSets: 3,
            targetRepsMin: 12,
            targetRepsMax: 15,
            targetWeightKg: null,
            targetRpe: 7,
            restSeconds: 75,
            notes: null,
            exercise: EXERCISES.cableFly,
          },
          {
            id: 21,
            dayId: 7,
            exerciseId: 6,
            sortOrder: 3,
            targetSets: 3,
            targetRepsMin: 12,
            targetRepsMax: 15,
            targetWeightKg: 14,
            targetRpe: 8,
            restSeconds: 75,
            notes: null,
            exercise: EXERCISES.curl,
          },
          {
            id: 22,
            dayId: 7,
            exerciseId: 9,
            sortOrder: 4,
            targetSets: 3,
            targetRepsMin: 10,
            targetRepsMax: 12,
            targetWeightKg: 60,
            targetRpe: 7,
            restSeconds: 90,
            notes: null,
            exercise: EXERCISES.rdl,
          },
        ],
      },
    ],
  },
];

let nextPlanId = 3;
let nextDayId = 8;
let nextExerciseId = 23;

export const workoutPlanApiService = {
  findAll: async (): Promise<WorkoutPlan[]> => {
    await delay(500);
    return [...mockPlans].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },

  findOne: async (id: number): Promise<WorkoutPlan> => {
    await delay(300);
    const plan = mockPlans.find((p) => p.id === id);
    if (!plan) throw new Error("Workout plan not found");
    return { ...plan };
  },

  create: async (dto: CreateWorkoutPlanDto): Promise<WorkoutPlan> => {
    await delay(600);
    const planId = nextPlanId++;
    const days = (dto.days ?? []).map((day) => {
      const dayId = nextDayId++;
      return {
        id: dayId,
        planId,
        dayNumber: day.dayNumber,
        name: day.name ?? null,
        isRestDay: day.isRestDay ?? false,
        workoutPlanExercises: (day.exercises ?? []).map((exDto) => ({
          id: nextExerciseId++,
          dayId,
          exerciseId: exDto.exerciseId,
          sortOrder: exDto.sortOrder,
          targetSets: exDto.targetSets,
          targetRepsMin: exDto.targetRepsMin,
          targetRepsMax: exDto.targetRepsMax,
          targetWeightKg: exDto.targetWeightKg ?? null,
          targetRpe: exDto.targetRpe ?? null,
          restSeconds: exDto.restSeconds ?? null,
          notes: exDto.notes ?? null,
          exercise: ex(exDto.exerciseId, `Exercise ${exDto.exerciseId}`),
        })),
      };
    });
    const plan: WorkoutPlan = {
      id: planId,
      userId: 1,
      name: dto.name,
      description: dto.description ?? null,
      trainingGoal: dto.trainingGoal,
      daysPerWeek: dto.daysPerWeek,
      durationWeeks: dto.durationWeeks,
      startedAt: dto.startedAt ?? null,
      isActive: false,
      source: "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      workoutPlanDays: days,
    };
    mockPlans.unshift(plan);
    return plan;
  },

  update: async (
    id: number,
    dto: UpdateWorkoutPlanDto,
  ): Promise<WorkoutPlan> => {
    await delay(400);
    const index = mockPlans.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Workout plan not found");
    const updated: WorkoutPlan = {
      ...mockPlans[index],
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.trainingGoal !== undefined && { trainingGoal: dto.trainingGoal }),
      ...(dto.daysPerWeek !== undefined && { daysPerWeek: dto.daysPerWeek }),
      ...(dto.durationWeeks !== undefined && {
        durationWeeks: dto.durationWeeks,
      }),
      ...(dto.startedAt !== undefined && { startedAt: dto.startedAt }),
      updatedAt: new Date().toISOString(),
    };
    mockPlans[index] = updated;
    return updated;
  },

  activate: async (id: number): Promise<WorkoutPlan> => {
    await delay(400);
    const plan = mockPlans.find((p) => p.id === id);
    if (!plan) throw new Error("Workout plan not found");
    mockPlans = mockPlans.map((p) => ({ ...p, isActive: p.id === id }));
    return { ...mockPlans.find((p) => p.id === id)! };
  },

  remove: async (id: number): Promise<{ message: string }> => {
    await delay(300);
    const index = mockPlans.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Workout plan not found");
    mockPlans.splice(index, 1);
    return { message: "Workout plan deleted" };
  },
};
