import { useState, useCallback } from "react";
import { toast } from "react-toastify";

import {
  useGetDashboardOverviewQuery,
  useGetStrengthProgressQuery,
  useGetWeightTrendQuery,
  useGetWorkoutConsistencyQuery,
  useGetNutritionAdherenceQuery,
  useGetKpiSnapshotsQuery,
  useCreateKpiSnapshotMutation,
} from "@/store/services/dashboardApi";
import type { WeightTrendPeriod } from "../types";

export function useDashboardActions() {
  const [period, setPeriod] = useState<WeightTrendPeriod>("month");

  const { data: overview, isLoading: isOverviewLoading } =
    useGetDashboardOverviewQuery();

  const { data: strengthProgress, isLoading: isStrengthLoading } =
    useGetStrengthProgressQuery();

  const { data: weightTrend, isLoading: isWeightTrendLoading } =
    useGetWeightTrendQuery({ period });

  const { data: workoutConsistency, isLoading: isConsistencyLoading } =
    useGetWorkoutConsistencyQuery();

  const { data: nutritionAdherence, isLoading: isAdherenceLoading } =
    useGetNutritionAdherenceQuery();

  const { data: kpiSnapshots, isLoading: isSnapshotsLoading } =
    useGetKpiSnapshotsQuery();

  const [createKpiSnapshot, { isLoading: isCreatingSnapshot }] =
    useCreateKpiSnapshotMutation();

  const handleCreateSnapshot = useCallback(async () => {
    try {
      const snapshot = await createKpiSnapshot().unwrap();
      toast.success(
        `KPI snapshot saved — consistency ${snapshot.consistencyScore}%`,
      );
    } catch (err) {
      toast.error(
        (err as { message?: string }).message ?? "Failed to save snapshot",
      );
    }
  }, [createKpiSnapshot]);

  return {
    overview: overview ?? null,
    isOverviewLoading,
    strengthProgress: strengthProgress ?? null,
    isStrengthLoading,
    weightTrend: weightTrend ?? null,
    isWeightTrendLoading,
    period,
    setPeriod,
    workoutConsistency: workoutConsistency ?? null,
    isConsistencyLoading,
    nutritionAdherence: nutritionAdherence ?? null,
    isAdherenceLoading,
    kpiSnapshots: kpiSnapshots ?? [],
    isSnapshotsLoading,
    isCreatingSnapshot,
    handleCreateSnapshot,
  };
}
