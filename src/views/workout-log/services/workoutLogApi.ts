import type {
  CompleteSessionDto,
  GetSessionsParams,
  LogSetDto,
  SessionsResponse,
  StartSessionDto,
  WorkoutSession,
  WorkoutSet,
} from "../types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const hoursAgo = (h: number) =>
  new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
const minutesAgo = (m: number) =>
  new Date(Date.now() - m * 60 * 1000).toISOString();

const EXERCISE_STUBS: Record<number, { id: number; name: string }> = {
  1: { id: 1, name: "Barbell Bench Press" },
  2: { id: 2, name: "Barbell Back Squat" },
  3: { id: 3, name: "Conventional Deadlift" },
  4: { id: 4, name: "Overhead Press" },
  5: { id: 5, name: "Pull-up" },
  6: { id: 6, name: "Dumbbell Bicep Curl" },
  7: { id: 7, name: "Tricep Pushdown" },
  8: { id: 8, name: "Leg Press" },
  9: { id: 9, name: "Romanian Deadlift" },
  10: { id: 10, name: "Lat Pulldown" },
  11: { id: 11, name: "Dumbbell Lateral Raise" },
  12: { id: 12, name: "Cable Fly" },
  13: { id: 13, name: "Plank" },
  14: { id: 14, name: "Kettlebell Swing" },
};

const mockSessions: WorkoutSession[] = [
  {
    id: 1,
    userId: 1,
    workoutPlanDayId: 1,
    status: "completed",
    notes: "Felt strong today. PR on squat.",
    startedAt: hoursAgo(49),
    completedAt: hoursAgo(48),
    durationMinutes: 62,
    workoutSets: [
      {
        id: 1,
        workoutSessionId: 1,
        exerciseId: 2,
        setNumber: 1,
        reps: 5,
        weightKg: 120,
        rpe: 7,
        isWarmup: true,
        notes: null,
        exercise: EXERCISE_STUBS[2],
      },
      {
        id: 2,
        workoutSessionId: 1,
        exerciseId: 2,
        setNumber: 2,
        reps: 5,
        weightKg: 140,
        rpe: 8,
        isWarmup: false,
        notes: null,
        exercise: EXERCISE_STUBS[2],
      },
      {
        id: 3,
        workoutSessionId: 1,
        exerciseId: 2,
        setNumber: 3,
        reps: 5,
        weightKg: 150,
        rpe: 9,
        isWarmup: false,
        notes: "New PR",
        exercise: EXERCISE_STUBS[2],
      },
      {
        id: 4,
        workoutSessionId: 1,
        exerciseId: 3,
        setNumber: 1,
        reps: 3,
        weightKg: 180,
        rpe: 8,
        isWarmup: false,
        notes: null,
        exercise: EXERCISE_STUBS[3],
      },
    ],
  },
  {
    id: 2,
    userId: 1,
    workoutPlanDayId: null,
    status: "completed",
    notes: null,
    startedAt: hoursAgo(25),
    completedAt: hoursAgo(24),
    durationMinutes: 45,
    workoutSets: [
      {
        id: 5,
        workoutSessionId: 2,
        exerciseId: 1,
        setNumber: 1,
        reps: 8,
        weightKg: 80,
        rpe: 7,
        isWarmup: true,
        notes: null,
        exercise: EXERCISE_STUBS[1],
      },
      {
        id: 6,
        workoutSessionId: 2,
        exerciseId: 1,
        setNumber: 2,
        reps: 8,
        weightKg: 100,
        rpe: 8,
        isWarmup: false,
        notes: null,
        exercise: EXERCISE_STUBS[1],
      },
      {
        id: 7,
        workoutSessionId: 2,
        exerciseId: 4,
        setNumber: 1,
        reps: 10,
        weightKg: 60,
        rpe: 7,
        isWarmup: false,
        notes: null,
        exercise: EXERCISE_STUBS[4],
      },
    ],
  },
  {
    id: 3,
    userId: 1,
    workoutPlanDayId: null,
    status: "skipped",
    notes: "Rest day — felt fatigued",
    startedAt: hoursAgo(3),
    completedAt: null,
    durationMinutes: null,
    workoutSets: [],
  },
  {
    id: 4,
    userId: 1,
    workoutPlanDayId: 2,
    status: "in_progress",
    notes: null,
    startedAt: minutesAgo(30),
    completedAt: null,
    durationMinutes: null,
    workoutSets: [
      {
        id: 8,
        workoutSessionId: 4,
        exerciseId: 5,
        setNumber: 1,
        reps: 6,
        weightKg: null,
        rpe: 7,
        isWarmup: false,
        notes: null,
        exercise: EXERCISE_STUBS[5],
      },
    ],
  },
];

let nextSessionId = 5;
let nextSetId = 9;

export const workoutLogApiService = {
  findAll: async (params: GetSessionsParams): Promise<SessionsResponse> => {
    await delay(400);
    let filtered = [...mockSessions];

    if (params.status) {
      filtered = filtered.filter((s) => s.status === params.status);
    }

    filtered.sort(
      (a, b) =>
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
    );

    const total = filtered.length;
    const start = (params.page - 1) * params.limit;
    const data = filtered.slice(start, start + params.limit);

    return { data, total, page: params.page, limit: params.limit };
  },

  findOne: async (id: number): Promise<WorkoutSession> => {
    await delay(300);
    const session = mockSessions.find((s) => s.id === id);
    if (!session) throw new Error("Workout session not found");
    return { ...session, workoutSets: [...session.workoutSets] };
  },

  startSession: async (dto: StartSessionDto): Promise<WorkoutSession> => {
    await delay(500);
    const session: WorkoutSession = {
      id: nextSessionId++,
      userId: 1,
      workoutPlanDayId: dto.workoutPlanDayId ?? null,
      status: "in_progress",
      notes: dto.notes ?? null,
      startedAt: new Date().toISOString(),
      completedAt: null,
      durationMinutes: null,
      workoutSets: [],
    };
    mockSessions.unshift(session);
    return { ...session };
  },

  logSet: async (sessionId: number, dto: LogSetDto): Promise<WorkoutSet> => {
    await delay(300);
    const session = mockSessions.find((s) => s.id === sessionId);
    if (!session) throw new Error("Workout session not found");
    if (session.status !== "in_progress")
      throw new Error("Session is not in progress");

    const exercise = EXERCISE_STUBS[dto.exerciseId];
    if (!exercise) throw new Error("Exercise not found");

    const set: WorkoutSet = {
      id: nextSetId++,
      workoutSessionId: sessionId,
      exerciseId: dto.exerciseId,
      setNumber: dto.setNumber,
      reps: dto.reps,
      weightKg: dto.weightKg ?? null,
      rpe: dto.rpe ?? null,
      isWarmup: dto.isWarmup,
      notes: dto.notes ?? null,
      exercise,
    };

    const index = mockSessions.findIndex((s) => s.id === sessionId);
    mockSessions[index] = {
      ...mockSessions[index],
      workoutSets: [...mockSessions[index].workoutSets, set],
    };

    return { ...set };
  },

  completeSession: async (
    sessionId: number,
    dto: CompleteSessionDto,
  ): Promise<WorkoutSession> => {
    await delay(400);
    const index = mockSessions.findIndex((s) => s.id === sessionId);
    if (index === -1) throw new Error("Workout session not found");
    if (mockSessions[index].status !== "in_progress")
      throw new Error("Session is not in progress");

    const startedAt = new Date(mockSessions[index].startedAt);
    const completedAt = new Date();
    const durationMinutes = Math.round(
      (completedAt.getTime() - startedAt.getTime()) / 60000,
    );

    const updated: WorkoutSession = {
      ...mockSessions[index],
      status: "completed",
      completedAt: completedAt.toISOString(),
      durationMinutes,
      ...(dto.notes !== undefined && { notes: dto.notes }),
    };

    mockSessions[index] = updated;
    return { ...updated, workoutSets: [...updated.workoutSets] };
  },

  deleteSession: async (id: number): Promise<{ message: string }> => {
    await delay(300);
    const index = mockSessions.findIndex((s) => s.id === id);
    if (index === -1) throw new Error("Workout session not found");
    mockSessions.splice(index, 1);
    return { message: "Workout session deleted" };
  },
};
