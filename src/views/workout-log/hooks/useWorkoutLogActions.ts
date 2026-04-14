import { useState } from "react";

import { toast } from "react-toastify";

import { useGetActivePlanQuery } from "@/store/services/workoutPlanApi";
import {
  useDeleteWorkoutSessionMutation,
  useGetWorkoutSessionsQuery,
  useStartWorkoutSessionMutation,
} from "@/store/services/workoutLogApi";
import type { SessionStatus, StartSessionDto } from "../types";
import type { WorkoutPlanDay } from "@/views/workout-plans/types";

export function useWorkoutLogActions() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<SessionStatus | "">("");
  const [startDialogOpen, setStartDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: activePlan } = useGetActivePlanQuery();

  const activePlanDays: WorkoutPlanDay[] =
    activePlan?.days?.filter((d) => !d.isRestDay) ?? [];

  const { data, isLoading, isFetching } = useGetWorkoutSessionsQuery({
    page,
    limit,
    ...(statusFilter && { status: statusFilter }),
  });

  const [startWorkoutSession, { isLoading: isStarting }] =
    useStartWorkoutSessionMutation();
  const [deleteWorkoutSession, { isLoading: isDeleting }] =
    useDeleteWorkoutSessionMutation();

  const handleStatusFilter = (value: SessionStatus | "") => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleStartSession = async (dto: StartSessionDto) => {
    try {
      await startWorkoutSession(dto).unwrap();
      toast.success("Session started");
      setStartDialogOpen(false);
    } catch {
      toast.error("Failed to start session");
    }
  };

  const confirmDelete = (id: number) => setDeleteId(id);
  const cancelDelete = () => setDeleteId(null);

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteWorkoutSession(deleteId).unwrap();
      toast.success("Session deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete session");
    }
  };

  return {
    sessions: data?.data ?? [],
    total: data?.total ?? 0,
    page,
    limit,
    statusFilter,
    isLoading,
    isFetching,
    isStarting,
    isDeleting,
    startDialogOpen,
    deleteId,
    activePlanDays,
    activePlanName: activePlan?.name ?? null,
    setPage,
    setLimit,
    handleStatusFilter,
    openStartDialog: () => setStartDialogOpen(true),
    closeStartDialog: () => setStartDialogOpen(false),
    handleStartSession,
    confirmDelete,
    cancelDelete,
    handleDelete,
  };
}
