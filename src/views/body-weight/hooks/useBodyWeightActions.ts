import { useState, useCallback } from "react";
import { toast } from "react-toastify";

import {
  useGetBodyWeightLogsQuery,
  useGetLatestBodyWeightQuery,
  useGetWeeklyAveragesQuery,
  useLogBodyWeightMutation,
  useDeleteBodyWeightLogMutation,
} from "@/store/services/bodyWeightApi";
import { useGetProfileQuery } from "@/store/services/userProfileApi";
import type { LogBodyWeightDto } from "../types";

export function useBodyWeightActions() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
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

  const { data: profile } = useGetProfileQuery();
  const isCoachMode = profile?.isCoachMode ?? false;

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

  const handleDeleteRequest = useCallback((id: number) => {
    setPendingDeleteId(id);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (pendingDeleteId === null) return;
    try {
      await deleteBodyWeightLog(pendingDeleteId).unwrap();
      toast.success("Log entry deleted");
    } catch (err) {
      toast.error(
        (err as { message?: string }).message ?? "Failed to delete entry",
      );
    } finally {
      setPendingDeleteId(null);
    }
  }, [deleteBodyWeightLog, pendingDeleteId]);

  const handleDeleteCancel = useCallback(() => {
    setPendingDeleteId(null);
  }, []);

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
    handleDeleteRequest,
    handleDeleteConfirm,
    handleDeleteCancel,
    confirmDeleteOpen: pendingDeleteId !== null,
    isCoachMode,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    weeksFilter,
    setWeeksFilter,
  };
}
