export type SessionStatus = "in_progress" | "completed" | "skipped";

export type WorkoutSet = {
  id: number;
  workoutSessionId: number;
  exerciseId: number;
  setNumber: number;
  reps: number;
  weightKg: number | null;
  rpe: number | null;
  isWarmup: boolean;
  notes: string | null;
  performedAt: string;
  exercise: {
    id: number;
    name: string;
    description: string | null;
    category: string;
    difficulty: string;
    isBodyweight: boolean;
  };
};

export type WorkoutSession = {
  id: number;
  userId: number;
  workoutPlanDayId: number | null;
  status: SessionStatus;
  notes: string | null;
  startedAt: string;
  completedAt: string | null;
  durationMinutes: number | null;
  sets: WorkoutSet[];
};

export type SessionsResponse = {
  data: WorkoutSession[];
  total: number;
  page: number;
  limit: number;
};

export type GetSessionsParams = {
  page: number;
  limit: number;
  status?: SessionStatus;
};

export type StartSessionDto = {
  workoutPlanDayId?: number;
  notes?: string;
};

export type LogSetDto = {
  exerciseId: number;
  setNumber: number;
  reps: number;
  weightKg?: number;
  rpe?: number;
  isWarmup: boolean;
  notes?: string;
};

export type CompleteSessionDto = {
  notes?: string;
};

export type SkipSessionDto = {
  notes?: string;
};
