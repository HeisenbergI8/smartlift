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
  body: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
};

export type NotificationPreference = {
  id: number;
  userId: number;
  type: NotificationType;
  isEnabled: boolean;
};

export type NotificationsResponse = {
  data: Notification[];
  total: number;
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

export type PreferencesResponse = {
  data: NotificationPreference[];
};

export type UpdateNotificationPrefsDto = {
  type: NotificationType;
  isEnabled: boolean;
};
