import { useState, useCallback } from "react";
import { toast } from "react-toastify";

import {
  useGetProgressionSettingsQuery,
  useUpsertProgressionSettingsMutation,
  useGetProgressionHistoryQuery,
  useGetProgressionHistoryByExerciseQuery,
  useEvaluateProgressionMutation,
} from "@/store/services/progressionApi";
import type {
  ProgressionSettings,
  UpdateProgressionSettingsDto,
} from "../types";

const DEFAULT_LIMIT = 20;

export function useProgressionActions() {
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [exerciseIdFilter, setExerciseIdFilter] = useState<number | "">("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIMIT);

  const { data: settings, isLoading: isSettingsLoading } =
    useGetProgressionSettingsQuery();

  const isExerciseFilter = exerciseIdFilter !== "";

  const { data: allHistoryData, isLoading: isAllHistoryLoading } =
    useGetProgressionHistoryQuery(
      { page: page + 1, limit: rowsPerPage },
      { skip: isExerciseFilter },
    );

  const { data: exerciseHistoryData, isLoading: isExerciseHistoryLoading } =
    useGetProgressionHistoryByExerciseQuery(
      {
        exerciseId: exerciseIdFilter as number,
        page: page + 1,
        limit: rowsPerPage,
      },
      { skip: !isExerciseFilter },
    );

  const historyData = isExerciseFilter ? exerciseHistoryData : allHistoryData;
  const isHistoryLoading = isExerciseFilter
    ? isExerciseHistoryLoading
    : isAllHistoryLoading;

  const [upsertSettings, { isLoading: isUpserting }] =
    useUpsertProgressionSettingsMutation();
  const [evaluate, { isLoading: isEvaluating }] =
    useEvaluateProgressionMutation();

  const handleExerciseFilter = useCallback((value: number | "") => {
    setExerciseIdFilter(value);
    setPage(0);
  }, []);

  const handlePageChange = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(e.target.value, 10));
      setPage(0);
    },
    [],
  );

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
    history: historyData?.data ?? [],
    historyTotal: historyData?.total ?? 0,
    isHistoryLoading,
    page,
    rowsPerPage,
    settingsDialogOpen,
    openSettingsDialog: () => setSettingsDialogOpen(true),
    closeSettingsDialog: () => setSettingsDialogOpen(false),
    isUpserting,
    isEvaluating,
    exerciseIdFilter,
    handleExerciseFilter,
    handlePageChange,
    handleRowsPerPageChange,
    handleUpsertSettings,
    handleEvaluate,
  };
}
