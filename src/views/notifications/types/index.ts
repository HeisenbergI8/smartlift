export type NotificationType =
  | "workout_reminder"
  | "missed_session"
  | "nutrition_reminder"
  | "ego_lift_warning"
  | "progression_update"
  | "milestone"
  | "general";

export type Notification = {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  referenceType: string | null;
  referenceId: number | null;
  isRead: boolean;
  readAt: string | null;
  scheduledAt: string | null;
  createdAt: string;
};

export type NotificationPreference = {
  id: number;
  userId: number;
  type: NotificationType;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NotificationsResponse = {
  data: Notification[];
  total: number;
  page: number;
  limit: number;
};

export type GetNotificationsParams = {
  page?: number;
  limit?: number;
};

export type UnreadCountResponse = {
  count: number;
};

export type MarkAllReadResponse = {
  updated: number;
};

export type PreferencesResponse = NotificationPreference[];

export type UpdateNotificationPrefsDto = {
  type: NotificationType;
  isEnabled: boolean;
};
