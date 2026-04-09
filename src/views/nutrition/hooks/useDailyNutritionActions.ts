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

  const { data: adjustments, isLoading: isAdjustmentsLoading } =
    useGetNutritionAdjustmentHistoryQuery();

  const [logDailyNutrition, { isLoading: isLogging }] =
    useLogDailyNutritionMutation();

  const [detectPlateau, { isLoading: isDetecting }] =
    useDetectPlateauMutation();

  const logs = logsData?.data ?? [];

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
        toast.success("Plateau detected — recommendation adjusted");
      } else if (result.plateauDetected) {
        toast.info(result.reason ?? "Plateau detected — no adjustment needed");
      } else {
        toast.info("No weight plateau detected");
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
    adjustments: adjustments ?? [],
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
