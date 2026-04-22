import { useState, useCallback } from "react";
import { toast } from "react-toastify";

import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useGetPreferencesQuery,
  useUpdatePreferenceMutation,
} from "@/store/services/notificationsApi";
import type {
  NotificationType,
  UpdateNotificationPrefsDto,
  GetNotificationsParams,
} from "../types";

export type ActiveTab = "notifications" | "preferences";
export type ReadFilter = "all" | "unread" | "read";

export function useNotificationActions() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("notifications");
  const [typeFilter, setTypeFilter] = useState<NotificationType | "">("");
  const [readFilter, setReadFilter] = useState<ReadFilter>("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const queryParams: GetNotificationsParams = {
    page: page + 1,
    limit: rowsPerPage,
  };

  const {
    data: notificationsData,
    isLoading: notificationsLoading,
    isFetching,
  } = useGetNotificationsQuery(queryParams);

  const { data: unreadCountData } = useGetUnreadCountQuery();

  const { data: preferencesData, isLoading: preferencesLoading } =
    useGetPreferencesQuery();

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAll }] =
    useMarkAllAsReadMutation();
  const [updatePreference] = useUpdatePreferenceMutation();

  const allNotifications = notificationsData?.data ?? [];
  const total = notificationsData?.total ?? 0;
  const unreadCount = unreadCountData?.count ?? 0;
  const preferences = preferencesData ?? [];

  const filteredNotifications = allNotifications.filter((n) => {
    if (typeFilter !== "" && n.type !== typeFilter) return false;
    if (readFilter === "unread" && n.isRead) return false;
    if (readFilter === "read" && !n.isRead) return false;
    return true;
  });

  const handleMarkAsRead = useCallback(
    async (id: number) => {
      try {
        await markAsRead(id).unwrap();
        toast.success("Notification marked as read");
      } catch (err) {
        toast.error((err as Error).message ?? "Failed to mark as read");
      }
    },
    [markAsRead],
  );

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      const result = await markAllAsRead().unwrap();
      if (result.updated > 0) {
        toast.success(
          `${result.updated} notification${result.updated > 1 ? "s" : ""} marked as read`,
        );
      } else {
        toast.info("No unread notifications");
      }
    } catch (err) {
      toast.error((err as Error).message ?? "Failed to mark all as read");
    }
  }, [markAllAsRead]);

  const handleUpdatePreference = useCallback(
    async (dto: UpdateNotificationPrefsDto) => {
      try {
        await updatePreference(dto).unwrap();
        toast.success(
          `${dto.type.replace(/_/g, " ")} notifications ${dto.isEnabled ? "enabled" : "disabled"}`,
        );
      } catch (err) {
        toast.error((err as Error).message ?? "Failed to update preference");
      }
    },
    [updatePreference],
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  return {
    activeTab,
    setActiveTab,
    typeFilter,
    setTypeFilter,
    readFilter,
    setReadFilter,
    page,
    rowsPerPage,
    filteredNotifications,
    total,
    unreadCount,
    preferences,
    notificationsLoading,
    isFetching,
    preferencesLoading,
    isMarkingAll,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleUpdatePreference,
    handlePageChange,
    handleRowsPerPageChange,
  };
}
