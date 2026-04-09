import { useState, useCallback } from "react";
import { toast } from "react-toastify";

import {
  useGetEgoLiftAlertsQuery,
  useDismissEgoLiftAlertMutation,
} from "@/store/services/egoLiftApi";
import type { EgoLiftAlert } from "../types";

export function useEgoLiftActions() {
  const [exerciseIdFilter, setExerciseIdFilter] = useState<number | "">("");

  const { data, isLoading, isFetching } = useGetEgoLiftAlertsQuery();
  const [dismissAlert] = useDismissEgoLiftAlertMutation();

  const allAlerts: EgoLiftAlert[] = data?.data ?? [];

  const filteredAlerts =
    exerciseIdFilter !== ""
      ? allAlerts.filter((a) => a.exerciseId === exerciseIdFilter)
      : allAlerts;

  const handleExerciseFilter = (value: number | "") => {
    setExerciseIdFilter(value);
  };

  const handleDismiss = useCallback(
    async (id: number) => {
      try {
        await dismissAlert(id).unwrap();
        toast.success("Alert dismissed");
      } catch (err) {
        toast.error((err as Error).message ?? "Failed to dismiss alert");
      }
    },
    [dismissAlert],
  );

  return {
    alerts: filteredAlerts,
    isLoading,
    isFetching,
    exerciseIdFilter,
    handleExerciseFilter,
    handleDismiss,
  };
}
