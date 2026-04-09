import { useState, useCallback } from "react";
import { toast } from "react-toastify";

import {
  useGetBodyWeightLogsQuery,
  useGetLatestBodyWeightQuery,
  useGetWeeklyAveragesQuery,
  useLogBodyWeightMutation,
  useDeleteBodyWeightLogMutation,
} from "@/store/services/bodyWeightApi";
import type { LogBodyWeightDto } from "../types";

export function useBodyWeightActions() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [weeksFilter, setWeeksFilter] = useState(12);

  const { data: logsData, isLoading: isLogsLoading } =
    useGetBodyWeightLogsQuery(
      startDate || endDate
        ? { startDate: startDate || undefined, endDate: endDate || undefined }
        : undefined,
    );

  const { data: latest, isLoading: isLatestLoading } =
    useGetLatestBodyWeightQuery();

  const { data: weeklyAverages, isLoading: isWeeklyLoading } =
    useGetWeeklyAveragesQuery({ weeks: weeksFilter });

  const [logBodyWeight, { isLoading: isLogging }] = useLogBodyWeightMutation();
  const [deleteBodyWeightLog, { isLoading: isDeleting }] =
    useDeleteBodyWeightLogMutation();

  const logs = logsData?.data ?? [];

  const handleLogSubmit = useCallback(
    async (dto: LogBodyWeightDto) => {
      try {
        await logBodyWeight(dto).unwrap();
        toast.success("Weight logged successfully");
        setDialogOpen(false);
      } catch (err) {
        toast.error(
          (err as { message?: string }).message ?? "Failed to log weight",
        );
      }
    },
    [logBodyWeight],
  );

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await deleteBodyWeightLog(id).unwrap();
        toast.success("Log entry deleted");
      } catch (err) {
        toast.error(
          (err as { message?: string }).message ?? "Failed to delete entry",
        );
      }
    },
    [deleteBodyWeightLog],
  );

  return {
    logs,
    isLogsLoading,
    latest: latest ?? null,
    isLatestLoading,
    weeklyAverages: weeklyAverages ?? [],
    isWeeklyLoading,
    dialogOpen,
    openDialog: () => setDialogOpen(true),
    closeDialog: () => setDialogOpen(false),
    isLogging,
    isDeleting,
    handleLogSubmit,
    handleDelete,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    weeksFilter,
    setWeeksFilter,
  };
}
