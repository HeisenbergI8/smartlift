import { useState } from "react";

import { toast } from "react-toastify";

import {
  useActivateWorkoutPlanMutation,
  useAddWorkoutPlanDayMutation,
  useCreateWorkoutPlanMutation,
  useDeactivateWorkoutPlanMutation,
  useDeleteWorkoutPlanMutation,
  useGenerateWorkoutPlanMutation,
  useUpdateWorkoutPlanMutation,
} from "@/store/services/workoutPlanApi";
import type {
  CreateWorkoutPlanDayDto,
  CreateWorkoutPlanDto,
  GenerateWorkoutPlanDto,
  UpdateWorkoutPlanDto,
  WorkoutPlan,
} from "../types";

export function useWorkoutPlanActions() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<WorkoutPlan | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [addDayDialogOpen, setAddDayDialogOpen] = useState(false);

  const [createWorkoutPlan, { isLoading: isCreating }] =
    useCreateWorkoutPlanMutation();
  const [updateWorkoutPlan, { isLoading: isUpdating }] =
    useUpdateWorkoutPlanMutation();
  const [activateWorkoutPlan, { isLoading: isActivating }] =
    useActivateWorkoutPlanMutation();
  const [deactivateWorkoutPlan, { isLoading: isDeactivating }] =
    useDeactivateWorkoutPlanMutation();
  const [addWorkoutPlanDay, { isLoading: isAddingDay }] =
    useAddWorkoutPlanDayMutation();
  const [generateWorkoutPlan, { isLoading: isGenerating }] =
    useGenerateWorkoutPlanMutation();
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

  const handleDeactivate = async (id: number) => {
    try {
      await deactivateWorkoutPlan(id).unwrap();
      toast.success("Workout plan deactivated");
    } catch {
      toast.error("Failed to deactivate workout plan");
    }
  };

  const openAddDay = () => setAddDayDialogOpen(true);
  const closeAddDay = () => setAddDayDialogOpen(false);

  const handleAddDay = async (planId: number, dto: CreateWorkoutPlanDayDto) => {
    try {
      await addWorkoutPlanDay({ planId, dto }).unwrap();
      toast.success("Training day added");
      closeAddDay();
    } catch {
      toast.error("Failed to add training day");
    }
  };

  const openGenerate = () => setGenerateDialogOpen(true);
  const closeGenerate = () => setGenerateDialogOpen(false);

  const handleGenerate = async (dto: GenerateWorkoutPlanDto) => {
    try {
      const plan = await generateWorkoutPlan(dto).unwrap();
      toast.success(`"${plan.name}" generated and activated`);
      closeGenerate();
    } catch (err) {
      const msg = (err as { message?: string }).message;
      toast.error(msg ?? "Failed to generate workout plan");
    }
  };

  const confirmDelete = (id: number) => setDeleteId(id);
  const cancelDelete = () => setDeleteId(null);

  const handleDelete = async () => {
    if (deleteId === null) return;
    const idToDelete = deleteId;
    setDeleteId(null);
    try {
      await deleteWorkoutPlan(idToDelete).unwrap();
      toast.success("Workout plan deleted");
    } catch {
      toast.error("Failed to delete workout plan");
    }
  };

  return {
    dialogOpen,
    editTarget,
    deleteId,
    generateDialogOpen,
    addDayDialogOpen,
    isCreating,
    isUpdating,
    isActivating,
    isDeactivating,
    isAddingDay,
    isGenerating,
    isDeleting,
    openCreate,
    openEdit,
    closeDialog,
    handleCreate,
    handleUpdate,
    handleActivate,
    handleDeactivate,
    openAddDay,
    closeAddDay,
    handleAddDay,
    openGenerate,
    closeGenerate,
    handleGenerate,
    confirmDelete,
    cancelDelete,
    handleDelete,
  };
}
