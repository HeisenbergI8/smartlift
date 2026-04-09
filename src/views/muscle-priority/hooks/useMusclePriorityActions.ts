import { useCallback, useState } from "react";
import { toast } from "react-toastify";

import {
  useGetUserPrioritiesQuery,
  useUpsertPriorityMutation,
  useDeletePriorityMutation,
} from "@/store/services/musclePriorityApi";

import type { UpsertMusclePriorityDto, UserMusclePriority } from "../types";

export function useMusclePriorityActions() {
  const { data, isLoading } = useGetUserPrioritiesQuery();
  const [upsert, { isLoading: isUpserting }] = useUpsertPriorityMutation();
  const [remove, { isLoading: isDeleting }] = useDeletePriorityMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<UserMusclePriority | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const openCreate = useCallback(() => {
    setEditTarget(null);
    setDialogOpen(true);
  }, []);

  const openEdit = useCallback((priority: UserMusclePriority) => {
    setEditTarget(priority);
    setDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
    setEditTarget(null);
  }, []);

  const handleUpsert = useCallback(
    async (dto: UpsertMusclePriorityDto) => {
      try {
        await upsert(dto).unwrap();
        toast.success(editTarget ? "Priority updated" : "Priority added");
        closeDialog();
      } catch (err) {
        toast.error((err as Error).message ?? "Failed to save priority");
      }
    },
    [upsert, editTarget, closeDialog],
  );

  const confirmDelete = useCallback((muscleGroupId: number) => {
    setDeleteId(muscleGroupId);
  }, []);

  const cancelDelete = useCallback(() => {
    setDeleteId(null);
  }, []);

  const handleDelete = useCallback(async () => {
    if (deleteId === null) return;
    try {
      await remove(deleteId).unwrap();
      toast.success("Priority removed");
      setDeleteId(null);
    } catch (err) {
      toast.error((err as Error).message ?? "Failed to remove priority");
    }
  }, [remove, deleteId]);

  return {
    priorities: data ?? [],
    isLoading,
    dialogOpen,
    editTarget,
    deleteId,
    isUpserting,
    isDeleting,
    openCreate,
    openEdit,
    closeDialog,
    handleUpsert,
    confirmDelete,
    cancelDelete,
    handleDelete,
  };
}
