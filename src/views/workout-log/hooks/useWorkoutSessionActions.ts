import { useState } from "react";

import { toast } from "react-toastify";

import {
  useCompleteWorkoutSessionMutation,
  useDeleteWorkoutSessionMutation,
  useGetWorkoutSessionQuery,
  useLogWorkoutSetMutation,
} from "@/store/services/workoutLogApi";
import type { CompleteSessionDto, LogSetDto } from "../types";

export function useWorkoutSessionActions(sessionId: number) {
  const [logSetDialogOpen, setLogSetDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    data: session,
    isLoading,
    isError,
  } = useGetWorkoutSessionQuery(sessionId);

  const [logWorkoutSet, { isLoading: isLoggingSet }] =
    useLogWorkoutSetMutation();
  const [completeWorkoutSession, { isLoading: isCompleting }] =
    useCompleteWorkoutSessionMutation();
  const [deleteWorkoutSession, { isLoading: isDeleting }] =
    useDeleteWorkoutSessionMutation();

  const handleLogSet = async (dto: LogSetDto) => {
    try {
      await logWorkoutSet({ sessionId, dto }).unwrap();
      toast.success("Set logged");
      setLogSetDialogOpen(false);
    } catch {
      toast.error("Failed to log set");
    }
  };

  const handleComplete = async (dto: CompleteSessionDto) => {
    try {
      await completeWorkoutSession({ sessionId, dto }).unwrap();
      toast.success("Session completed");
      setCompleteDialogOpen(false);
    } catch {
      toast.error("Failed to complete session");
    }
  };

  const handleDelete = async (onSuccess: () => void) => {
    try {
      await deleteWorkoutSession(sessionId).unwrap();
      toast.success("Session deleted");
      onSuccess();
    } catch {
      toast.error("Failed to delete session");
    }
  };

  return {
    session,
    isLoading,
    isError,
    logSetDialogOpen,
    completeDialogOpen,
    deleteDialogOpen,
    isLoggingSet,
    isCompleting,
    isDeleting,
    openLogSetDialog: () => setLogSetDialogOpen(true),
    closeLogSetDialog: () => setLogSetDialogOpen(false),
    openCompleteDialog: () => setCompleteDialogOpen(true),
    closeCompleteDialog: () => setCompleteDialogOpen(false),
    openDeleteDialog: () => setDeleteDialogOpen(true),
    closeDeleteDialog: () => setDeleteDialogOpen(false),
    handleLogSet,
    handleComplete,
    handleDelete,
  };
}
