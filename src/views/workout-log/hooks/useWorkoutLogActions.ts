import { useState } from "react";

import { toast } from "react-toastify";

import { useGetActivePlanQuery } from "@/store/services/workoutPlanApi";
import {
  useDeleteWorkoutSessionMutation,
  useGetWorkoutSessionsQuery,
  useSkipWorkoutSessionMutation,
  useStartWorkoutSessionMutation,
} from "@/store/services/workoutLogApi";
import type { SessionStatus, SkipSessionDto, StartSessionDto } from "../types";
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

  // Dedicated query to detect any in-progress session (enforces one-at-a-time UI)
  const { data: inProgressData } = useGetWorkoutSessionsQuery({
    page: 1,
    limit: 1,
    status: "in_progress",
  });

  const activeSession = inProgressData?.data?.[0] ?? null;
  const hasInProgressSession = (inProgressData?.total ?? 0) > 0;

  const [startWorkoutSession, { isLoading: isStarting }] =
    useStartWorkoutSessionMutation();
  const [skipWorkoutSession, { isLoading: isSkippingActive }] =
    useSkipWorkoutSessionMutation();
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
    } catch (err) {
      const message = (err as { message?: string }).message ?? "";
      if (message.toLowerCase().includes("already have a session")) {
        toast.error(
          "You already have a session in progress. Complete or skip it before starting a new one.",
        );
      } else {
        toast.error("Failed to start session");
      }
    }
  };

  const handleSkipActive = async (dto: SkipSessionDto) => {
    if (!activeSession) return;
    try {
      await skipWorkoutSession({ sessionId: activeSession.id, dto }).unwrap();
      toast.success("Session skipped");
    } catch {
      toast.error("Failed to skip session");
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

  const resolvePlanDayName = (
    workoutPlanDayId: number | null,
  ): string | null => {
    if (!workoutPlanDayId || !activePlan) return null;
    const day = activePlan.days.find((d) => d.id === workoutPlanDayId);
    if (!day) return null;
    return day.name ?? `Day ${day.dayNumber}`;
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
    isSkippingActive,
    isDeleting,
    startDialogOpen,
    deleteId,
    activePlanDays,
    activePlanName: activePlan?.name ?? null,
    hasActivePlan: !!activePlan,
    hasInProgressSession,
    activeSession,
    resolvePlanDayName,
    setPage,
    setLimit,
    handleStatusFilter,
    openStartDialog: () => setStartDialogOpen(true),
    closeStartDialog: () => setStartDialogOpen(false),
    handleStartSession,
    handleSkipActive,
    confirmDelete,
    cancelDelete,
    handleDelete,
  };
}
