import { useState, useCallback } from "react";
import { toast } from "react-toastify";

import {
  useGetProgressionSettingsQuery,
  useUpsertProgressionSettingsMutation,
  useGetProgressionHistoryQuery,
  useEvaluateProgressionMutation,
} from "@/store/services/progressionApi";
import type {
  ProgressionHistoryItem,
  ProgressionSettings,
  UpdateProgressionSettingsDto,
} from "../types";

export function useProgressionActions() {
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [exerciseIdFilter, setExerciseIdFilter] = useState<number | "">("");

  const {
    data: settings,
    isLoading: isSettingsLoading,
  } = useGetProgressionSettingsQuery();

  const {
    data: historyData,
    isLoading: isHistoryLoading,
  } = useGetProgressionHistoryQuery();

  const [upsertSettings, { isLoading: isUpserting }] =
    useUpsertProgressionSettingsMutation();
  const [evaluate, { isLoading: isEvaluating }] =
    useEvaluateProgressionMutation();

  const allHistory: ProgressionHistoryItem[] = historyData?.data ?? [];

  const filteredHistory =
    exerciseIdFilter !== ""
      ? allHistory.filter((h) => h.exerciseId === exerciseIdFilter)
      : allHistory;

  const handleUpsertSettings = useCallback(
    async (dto: UpdateProgressionSettingsDto) => {
      try {
        await upsertSettings(dto).unwrap();
        toast.success("Settings saved");
        setSettingsDialogOpen(false);
      } catch (err) {
        toast.error((err as Error).message ?? "Failed to save settings");
      }
    },
    [upsertSettings],
  );

  const handleEvaluate = useCallback(async () => {
    try {
      const result = await evaluate().unwrap();
      if (result.adjustments.length === 0) {
        toast.info(result.message);
      } else {
        toast.success(
          `Evaluation complete — ${result.adjustments.length} new adjustment${result.adjustments.length > 1 ? "s" : ""} created`,
        );
      }
    } catch (err) {
      toast.error((err as Error).message ?? "Evaluation failed");
    }
  }, [evaluate]);

  return {
    settings: settings as ProgressionSettings | undefined,
    isSettingsLoading,
    history: filteredHistory,
    isHistoryLoading,
    settingsDialogOpen,
    openSettingsDialog: () => setSettingsDialogOpen(true),
    closeSettingsDialog: () => setSettingsDialogOpen(false),
    isUpserting,
    isEvaluating,
    exerciseIdFilter,
    handleExerciseFilter: setExerciseIdFilter,
    handleUpsertSettings,
    handleEvaluate,
  };
}
