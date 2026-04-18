import { apiClient } from "@/libs/apiClient";
import type { EgoLiftAlert, EgoLiftAlertsResponse } from "../types";

function mapServerAlert(raw: any): EgoLiftAlert {
  return {
    id: Number(raw.id),
    userId: Number(raw.userId),
    exerciseId: Number(raw.exerciseId),
    workoutSetId: Number(raw.workoutSetId),
    severity: raw.severity,
    message: raw.message,
    previousWeightKg:
      typeof raw.previousWeightKg === "string"
        ? parseFloat(raw.previousWeightKg)
        : raw.previousWeightKg,
    flaggedWeightKg:
      typeof raw.flaggedWeightKg === "string"
        ? parseFloat(raw.flaggedWeightKg)
        : raw.flaggedWeightKg,
    previousReps: Number(raw.previousReps),
    flaggedReps: Number(raw.flaggedReps),
    trainingGoal: raw.trainingGoal,
    isDismissed: Boolean(raw.isDismissed),
    createdAt: raw.createdAt,
    exercise: {
      id: raw.exercise?.id ?? raw.exerciseId,
      name: raw.exercise?.name ?? "",
    },
  };
}

export const egoLiftApiService = {
  async getAlerts(): Promise<EgoLiftAlertsResponse> {
    const res = await apiClient.get<{
      data: any[];
      total?: number;
      page?: number;
      limit?: number;
    }>("/ego-lift-alerts?page=1&limit=20");
    const list = Array.isArray(res.data) ? res.data : [];
    return { data: list.map(mapServerAlert) };
  },

  async getAlertsByExercise(
    exerciseId: number,
  ): Promise<EgoLiftAlertsResponse> {
    const res = await apiClient.get<any[]>(
      `/ego-lift-alerts/exercise/${exerciseId}?page=1&limit=20`,
    );
    return { data: (Array.isArray(res) ? res : []).map(mapServerAlert) };
  },

  async dismissAlert(alertId: number): Promise<void> {
    await apiClient.patch<void>(`/ego-lift-alerts/${alertId}/dismiss`);
  },
};
