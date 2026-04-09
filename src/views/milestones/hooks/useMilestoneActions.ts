import { useState, useCallback } from "react";
import { toast } from "react-toastify";

import {
  useGetMilestonesQuery,
  useGetUserMilestonesQuery,
  useCheckAndAwardMilestonesMutation,
} from "@/store/services/milestonesApi";
import type { MilestoneCategory, Milestone, UserMilestone } from "../types";

export type ActiveTab = "catalog" | "achievements";

export function useMilestoneActions() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("catalog");
  const [categoryFilter, setCategoryFilter] = useState<MilestoneCategory | "">(
    "",
  );

  const { data: milestonesData, isLoading: milestonesLoading } =
    useGetMilestonesQuery();
  const { data: userMilestonesData, isLoading: userMilestonesLoading } =
    useGetUserMilestonesQuery();
  const [checkMilestones, { isLoading: isChecking }] =
    useCheckAndAwardMilestonesMutation();

  const allMilestones: Milestone[] = milestonesData?.data ?? [];
  const userMilestones: UserMilestone[] = userMilestonesData?.data ?? [];
  const earnedIds = new Set(userMilestones.map((um) => um.milestoneId));

  const filteredMilestones =
    categoryFilter !== ""
      ? allMilestones.filter((m) => m.category === categoryFilter)
      : allMilestones;

  const handleCheck = useCallback(async () => {
    try {
      const result = await checkMilestones().unwrap();
      const count = result.data.length;
      if (count > 0) {
        toast.success(
          `🏅 ${count} new milestone${count > 1 ? "s" : ""} awarded!`,
        );
      } else {
        toast.info("No new milestones earned yet. Keep going!");
      }
    } catch (err) {
      toast.error((err as Error).message ?? "Failed to check milestones");
    }
  }, [checkMilestones]);

  return {
    activeTab,
    setActiveTab,
    categoryFilter,
    setCategoryFilter,
    milestones: filteredMilestones,
    allMilestones,
    userMilestones,
    earnedIds,
    isLoading: milestonesLoading,
    userMilestonesLoading,
    isChecking,
    handleCheck,
  };
}
