import { useState } from "react";

import { toast } from "react-toastify";

import {
  useActivateWorkoutPlanMutation,
  useCreateWorkoutPlanMutation,
  useDeleteWorkoutPlanMutation,
  useUpdateWorkoutPlanMutation,
} from "@/store/services/workoutPlanApi";
import type {
  CreateWorkoutPlanDto,
  UpdateWorkoutPlanDto,
  WorkoutPlan,
} from "../types";

export function useWorkoutPlanActions() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<WorkoutPlan | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [createWorkoutPlan, { isLoading: isCreating }] =
    useCreateWorkoutPlanMutation();
  const [updateWorkoutPlan, { isLoading: isUpdating }] =
    useUpdateWorkoutPlanMutation();
  const [activateWorkoutPlan, { isLoading: isActivating }] =
    useActivateWorkoutPlanMutation();
  const [deleteWorkoutPlan, { isLoading: isDeleting }] =
    useDeleteWorkoutPlanMutation();

  const openCreate = () => {
    setEditTarget(null);
    setDialogOpen(true);
  };

  const openEdit = (plan: WorkoutPlan) => {
    setEditTarget(plan);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditTarget(null);
  };

  const handleCreate = async (dto: CreateWorkoutPlanDto) => {
    try {
      await createWorkoutPlan(dto).unwrap();
      toast.success("Workout plan created");
      closeDialog();
    } catch {
      toast.error("Failed to create workout plan");
    }
  };

  const handleUpdate = async (id: number, dto: UpdateWorkoutPlanDto) => {
    try {
      await updateWorkoutPlan({ id, dto }).unwrap();
      toast.success("Workout plan updated");
      closeDialog();
    } catch {
      toast.error("Failed to update workout plan");
    }
  };

  const handleActivate = async (id: number) => {
    try {
      await activateWorkoutPlan(id).unwrap();
      toast.success("Workout plan activated");
    } catch {
      toast.error("Failed to activate workout plan");
    }
  };

  const confirmDelete = (id: number) => setDeleteId(id);
  const cancelDelete = () => setDeleteId(null);

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteWorkoutPlan(deleteId).unwrap();
      toast.success("Workout plan deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete workout plan");
    }
  };

  return {
    dialogOpen,
    editTarget,
    deleteId,
    isCreating,
    isUpdating,
    isActivating,
    isDeleting,
    openCreate,
    openEdit,
    closeDialog,
    handleCreate,
    handleUpdate,
    handleActivate,
    confirmDelete,
    cancelDelete,
    handleDelete,
  };
}
