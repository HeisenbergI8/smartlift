import { useState, useCallback } from "react";
import { toast } from "react-toastify";

import {
  useGetDailyNutritionLogsQuery,
  useLogDailyNutritionMutation,
  useGetNutritionAdjustmentHistoryQuery,
  useDetectPlateauMutation,
} from "@/store/services/nutritionApi";
import type { LogDailyNutritionDto } from "../types";

export function useDailyNutritionActions() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: logsData, isLoading: isLogsLoading } =
    useGetDailyNutritionLogsQuery(
      startDate || endDate
        ? { startDate: startDate || undefined, endDate: endDate || undefined }
        : undefined,
    );

  const { data: adjustmentsData, isLoading: isAdjustmentsLoading } =
    useGetNutritionAdjustmentHistoryQuery();

  const [logDailyNutrition, { isLoading: isLogging }] =
    useLogDailyNutritionMutation();

  const [detectPlateau, { isLoading: isDetecting }] =
    useDetectPlateauMutation();

  const logs = logsData?.data ?? [];
  const adjustments = adjustmentsData?.data ?? [];

  const handleLogSubmit = useCallback(
    async (dto: LogDailyNutritionDto) => {
      try {
        await logDailyNutrition(dto).unwrap();
        toast.success("Daily nutrition log saved");
        setDialogOpen(false);
      } catch (err) {
        toast.error(
          (err as { message?: string }).message ?? "Failed to save log",
        );
      }
    },
    [logDailyNutrition],
  );

  const handleDetectPlateau = useCallback(async () => {
    try {
      const result = await detectPlateau().unwrap();
      if (result.plateauDetected && result.adjustment) {
        const newCals =
          result.newRecommendation?.dailyCaloriesKcal.toLocaleString();
        toast.success(
          newCals
            ? `Plateau detected — your target has been adjusted to ${newCals} kcal/day`
            : "Plateau detected — your nutrition recommendation has been updated",
        );
      } else if (result.plateauDetected) {
        toast.info(
          "Your goal doesn't require a calorie adjustment right now — keep it up!",
        );
      } else if (result.reason?.toLowerCase().includes("insufficient")) {
        toast.info(
          "Not enough data yet — log your weight for at least 3 weeks to enable plateau detection",
        );
      } else {
        toast.info(
          "Your weight is on track — no plateau detected. Keep logging!",
        );
      }
    } catch (err) {
      toast.error(
        (err as { message?: string }).message ?? "Plateau detection failed",
      );
    }
  }, [detectPlateau]);

  return {
    logs,
    isLogsLoading,
    adjustments,
    isAdjustmentsLoading,
    dialogOpen,
    openDialog: () => setDialogOpen(true),
    closeDialog: () => setDialogOpen(false),
    isLogging,
    handleLogSubmit,
    isDetecting,
    handleDetectPlateau,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
  };
}
