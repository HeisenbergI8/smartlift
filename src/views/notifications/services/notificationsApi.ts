import { apiClient } from "@/libs/apiClient";
import type {
  Notification,
  NotificationPreference,
  NotificationsResponse,
  GetNotificationsParams,
  UnreadCountResponse,
  MarkAllReadResponse,
  UpdateNotificationPrefsDto,
} from "../types";

export const notificationsApiService = {
  getNotifications: async (
    params: GetNotificationsParams,
  ): Promise<NotificationsResponse> => {
    return apiClient.get<NotificationsResponse>("/notifications", { params });
  },

  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    return apiClient.get<UnreadCountResponse>("/notifications/unread-count");
  },

  markAsRead: async (id: number): Promise<Notification> => {
    return apiClient.patch<Notification>(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<MarkAllReadResponse> => {
    return apiClient.patch<MarkAllReadResponse>("/notifications/read-all");
  },

  getPreferences: async (): Promise<NotificationPreference[]> => {
    return apiClient.get<NotificationPreference[]>(
      "/notifications/preferences",
    );
  },

  updatePreference: async (
    dto: UpdateNotificationPrefsDto,
  ): Promise<NotificationPreference> => {
    return apiClient.put<NotificationPreference>(
      "/notifications/preferences",
      dto,
    );
  },
};
