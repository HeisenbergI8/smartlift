import { useState } from "react";

import { toast } from "react-toastify";

import { useGetActivePlanQuery } from "@/store/services/workoutPlanApi";
import { useGetExercisesQuery } from "@/store/services/exerciseApi";
import {
  useCompleteWorkoutSessionMutation,
  useDeleteWorkoutSessionMutation,
  useGetWorkoutSessionQuery,
  useLogWorkoutSetMutation,
  useSkipWorkoutSessionMutation,
} from "@/store/services/workoutLogApi";
import type { CompleteSessionDto, LogSetDto, SkipSessionDto } from "../types";

export type ExerciseOption = { id: number; name: string };

export function useWorkoutSessionActions(sessionId: number) {
  const [logSetDialogOpen, setLogSetDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [skipDialogOpen, setSkipDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    data: session,
    isLoading,
    isError,
  } = useGetWorkoutSessionQuery(sessionId);

  const { data: activePlan } = useGetActivePlanQuery();

  const planDay = session?.workoutPlanDayId
    ? activePlan?.days?.find((d) => d.id === session.workoutPlanDayId)
    : undefined;

  const { data: allExercisesData } = useGetExercisesQuery(
    { page: 1, limit: 100 },
    { skip: !!planDay },
  );

  const exerciseOptions: ExerciseOption[] = planDay
    ? planDay.exercises.map((e) => ({
        id: e.exercise.id,
        name: e.exercise.name,
      }))
    : (allExercisesData?.data ?? []).map((e) => ({ id: e.id, name: e.name }));

  const [logWorkoutSet, { isLoading: isLoggingSet }] =
    useLogWorkoutSetMutation();
  const [completeWorkoutSession, { isLoading: isCompleting }] =
    useCompleteWorkoutSessionMutation();
  const [skipWorkoutSession, { isLoading: isSkipping }] =
    useSkipWorkoutSessionMutation();
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

  const handleSkip = async (dto: SkipSessionDto) => {
    try {
      await skipWorkoutSession({ sessionId, dto }).unwrap();
      toast.success("Session skipped");
      setSkipDialogOpen(false);
    } catch {
      toast.error("Failed to skip session");
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
    exerciseOptions,
    logSetDialogOpen,
    completeDialogOpen,
    skipDialogOpen,
    deleteDialogOpen,
    isLoggingSet,
    isCompleting,
    isSkipping,
    isDeleting,
    openLogSetDialog: () => setLogSetDialogOpen(true),
    closeLogSetDialog: () => setLogSetDialogOpen(false),
    openCompleteDialog: () => setCompleteDialogOpen(true),
    closeCompleteDialog: () => setCompleteDialogOpen(false),
    openSkipDialog: () => setSkipDialogOpen(true),
    closeSkipDialog: () => setSkipDialogOpen(false),
    openDeleteDialog: () => setDeleteDialogOpen(true),
    closeDeleteDialog: () => setDeleteDialogOpen(false),
    handleLogSet,
    handleComplete,
    handleSkip,
    handleDelete,
  };
}
