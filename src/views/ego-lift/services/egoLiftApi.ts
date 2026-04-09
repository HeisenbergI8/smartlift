import type { EgoLiftAlert, EgoLiftAlertsResponse } from "../types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const daysAgo = (d: number) =>
  new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString();

const mockAlerts: EgoLiftAlert[] = [
  {
    id: 1,
    userId: 1,
    exerciseId: 1,
    workoutSetId: 101,
    severity: "critical",
    message:
      "Weight increased by 22% while reps dropped by 40% — possible ego-lift detected.",
    previousWeightKg: 80,
    flaggedWeightKg: 97.6,
    previousReps: 10,
    flaggedReps: 6,
    trainingGoal: "hypertrophy",
    isDismissed: false,
    createdAt: daysAgo(1),
    exercise: { id: 1, name: "Barbell Bench Press" },
  },
  {
    id: 2,
    userId: 1,
    exerciseId: 2,
    workoutSetId: 102,
    severity: "warning",
    message:
      "Weight increased by 12% while reps dropped by 25% — possible ego-lift detected.",
    previousWeightKg: 120,
    flaggedWeightKg: 134.4,
    previousReps: 5,
    flaggedReps: 3,
    trainingGoal: "strength",
    isDismissed: false,
    createdAt: daysAgo(3),
    exercise: { id: 2, name: "Barbell Back Squat" },
  },
  {
    id: 3,
    userId: 1,
    exerciseId: 3,
    workoutSetId: 103,
    severity: "critical",
    message:
      "Weight increased by 25% while reps dropped by 35% — possible ego-lift detected.",
    previousWeightKg: 160,
    flaggedWeightKg: 200,
    previousReps: 20,
    flaggedReps: 13,
    trainingGoal: "endurance",
    isDismissed: false,
    createdAt: daysAgo(5),
    exercise: { id: 3, name: "Conventional Deadlift" },
  },
  {
    id: 4,
    userId: 1,
    exerciseId: 1,
    workoutSetId: 104,
    severity: "warning",
    message:
      "Weight increased by 18% while reps dropped by 27% — possible ego-lift detected.",
    previousWeightKg: 75,
    flaggedWeightKg: 88.5,
    previousReps: 8,
    flaggedReps: 5,
    trainingGoal: "hypertrophy",
    isDismissed: false,
    createdAt: daysAgo(10),
    exercise: { id: 1, name: "Barbell Bench Press" },
  },
];

export const egoLiftApiService = {
  async getAlerts(): Promise<EgoLiftAlertsResponse> {
    await delay(300);
    return { data: mockAlerts.filter((a) => !a.isDismissed) };
  },

  async getAlertsByExercise(
    exerciseId: number,
  ): Promise<EgoLiftAlertsResponse> {
    await delay(200);
    return {
      data: mockAlerts.filter((a) => a.exerciseId === exerciseId),
    };
  },

  async dismissAlert(alertId: number): Promise<void> {
    await delay(150);
    const alert = mockAlerts.find((a) => a.id === alertId);
    if (!alert) throw new Error("Alert not found");
    alert.isDismissed = true;
  },
};
