import type {
  EvaluateProgressionResponse,
  ProgressionHistoryItem,
  ProgressionHistoryResponse,
  ProgressionSettings,
  UpdateProgressionSettingsDto,
} from "../types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const daysAgo = (d: number) =>
  new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString();

let mockSettings: ProgressionSettings = {
  id: 1,
  userId: 1,
  isEnabled: true,
  progressionFrequency: "weekly",
  trainingGoal: "hypertrophy",
  weightIncrementKg: 2.5,
  maxRepsBeforeIncrease: 12,
  createdAt: daysAgo(30),
  updatedAt: daysAgo(7),
};

let nextHistoryId = 5;

const mockHistory: ProgressionHistoryItem[] = [
  {
    id: 1,
    userId: 1,
    exerciseId: 1,
    adjustmentType: "weight_increase",
    previousValue: 80,
    newValue: 82.5,
    reason: "Avg reps (13) exceeded max reps threshold (12).",
    source: "auto",
    createdAt: daysAgo(7),
    exercise: { id: 1, name: "Barbell Bench Press" },
  },
  {
    id: 2,
    userId: 1,
    exerciseId: 2,
    adjustmentType: "deload",
    previousValue: 140,
    newValue: 126,
    reason: "Avg reps (4) fell below 50% of max reps threshold (12).",
    source: "auto",
    createdAt: daysAgo(14),
    exercise: { id: 2, name: "Barbell Back Squat" },
  },
  {
    id: 3,
    userId: 1,
    exerciseId: 3,
    adjustmentType: "reps_increase",
    previousValue: 10,
    newValue: 12,
    reason: "Consistent performance — target rep range increased.",
    source: "auto",
    createdAt: daysAgo(21),
    exercise: { id: 3, name: "Conventional Deadlift" },
  },
  {
    id: 4,
    userId: 1,
    exerciseId: 1,
    adjustmentType: "sets_increase",
    previousValue: 3,
    newValue: 4,
    reason: "Volume progression — adding one working set.",
    source: "manual",
    createdAt: daysAgo(28),
    exercise: { id: 1, name: "Barbell Bench Press" },
  },
];

export const progressionApiService = {
  async getSettings(): Promise<ProgressionSettings> {
    await delay(300);
    return { ...mockSettings };
  },

  async upsertSettings(
    dto: UpdateProgressionSettingsDto,
  ): Promise<ProgressionSettings> {
    await delay(400);
    mockSettings = {
      ...mockSettings,
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    return { ...mockSettings };
  },

  async getHistory(): Promise<ProgressionHistoryResponse> {
    await delay(300);
    const sorted = [...mockHistory].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return { data: sorted, meta: { total: sorted.length } };
  },

  async getHistoryByExercise(
    exerciseId: number,
  ): Promise<ProgressionHistoryResponse> {
    await delay(200);
    const filtered = mockHistory.filter((h) => h.exerciseId === exerciseId);
    return { data: filtered, meta: { total: filtered.length } };
  },

  async evaluateProgression(): Promise<EvaluateProgressionResponse> {
    await delay(500);
    if (!mockSettings.isEnabled) {
      return { message: "Progression tracking is disabled", adjustments: [] };
    }
    const newAdjustment: ProgressionHistoryItem = {
      id: nextHistoryId++,
      userId: 1,
      exerciseId: 1,
      adjustmentType: "weight_increase",
      previousValue: mockHistory[0]?.newValue ?? 82.5,
      newValue: (mockHistory[0]?.newValue ?? 82.5) + mockSettings.weightIncrementKg,
      reason: `Avg reps exceeded max reps threshold (${mockSettings.maxRepsBeforeIncrease}).`,
      source: "auto",
      createdAt: new Date().toISOString(),
      exercise: { id: 1, name: "Barbell Bench Press" },
    };
    mockHistory.unshift(newAdjustment);
    return {
      message: "Evaluation complete",
      adjustments: [newAdjustment],
    };
  },
};
