import type {
  Notification,
  NotificationPreference,
  NotificationsResponse,
  GetNotificationsParams,
  UnreadCountResponse,
  MarkAllReadResponse,
  PreferencesResponse,
  UpdateNotificationPrefsDto,
  NotificationType,
} from "../types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const minutesAgo = (m: number) =>
  new Date(Date.now() - m * 60 * 1000).toISOString();

const hoursAgo = (h: number) =>
  new Date(Date.now() - h * 60 * 60 * 1000).toISOString();

const daysAgo = (d: number) =>
  new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString();

let nextId = 11;

const mockNotifications: Notification[] = [
  {
    id: 1,
    userId: 1,
    type: "ego_lift_warning",
    title: "Ego-Lift Warning",
    body: "Weight increased by 22% while reps dropped by 40% on Barbell Bench Press — possible ego-lift detected.",
    isRead: false,
    readAt: null,
    createdAt: minutesAgo(15),
  },
  {
    id: 2,
    userId: 1,
    type: "milestone",
    title: "🏆 Milestone Unlocked!",
    body: "10 Sessions — You've completed 10 workout sessions. Keep it up!",
    isRead: false,
    readAt: null,
    createdAt: hoursAgo(2),
  },
  {
    id: 3,
    userId: 1,
    type: "progression_update",
    title: "Progression Update",
    body: "Weight adjusted for Barbell Back Squat based on your recent performance.",
    isRead: false,
    readAt: null,
    createdAt: hoursAgo(5),
  },
  {
    id: 4,
    userId: 1,
    type: "workout_reminder",
    title: "Time to Train!",
    body: "You haven't logged a workout today. Your scheduled push day is waiting.",
    isRead: false,
    readAt: null,
    createdAt: hoursAgo(8),
  },
  {
    id: 5,
    userId: 1,
    type: "nutrition_reminder",
    title: "Nutrition Log Reminder",
    body: "You haven't logged your meals today. Stay on track with your nutrition goals.",
    isRead: true,
    readAt: hoursAgo(6),
    createdAt: hoursAgo(12),
  },
  {
    id: 6,
    userId: 1,
    type: "missed_session",
    title: "Missed Session",
    body: "It looks like you missed your scheduled leg day on Monday. Consider rescheduling.",
    isRead: true,
    readAt: daysAgo(1),
    createdAt: daysAgo(2),
  },
  {
    id: 7,
    userId: 1,
    type: "progression_update",
    title: "Progression Update",
    body: "Weight adjusted for Conventional Deadlift — new working weight: 162.5 kg.",
    isRead: true,
    readAt: daysAgo(2),
    createdAt: daysAgo(3),
  },
  {
    id: 8,
    userId: 1,
    type: "milestone",
    title: "🏆 Milestone Unlocked!",
    body: "First Nutrition Log — You logged your first nutrition entry. Excellent start!",
    isRead: true,
    readAt: daysAgo(5),
    createdAt: daysAgo(6),
  },
  {
    id: 9,
    userId: 1,
    type: "ego_lift_warning",
    title: "Ego-Lift Warning",
    body: "Weight increased by 25% while reps dropped by 35% on Conventional Deadlift.",
    isRead: true,
    readAt: daysAgo(7),
    createdAt: daysAgo(8),
  },
  {
    id: 10,
    userId: 1,
    type: "general",
    title: "Welcome to SmartLift!",
    body: "Your account is set up and ready. Start by logging your first workout.",
    isRead: true,
    readAt: daysAgo(60),
    createdAt: daysAgo(60),
  },
];

const ALL_TYPES: NotificationType[] = [
  "workout_reminder",
  "missed_session",
  "nutrition_reminder",
  "ego_lift_warning",
  "progression_update",
  "milestone",
  "general",
];

const mockPreferences: NotificationPreference[] = ALL_TYPES.map((type, i) => ({
  id: i + 1,
  userId: 1,
  type,
  isEnabled: true,
}));

export const notificationsApiService = {
  async getNotifications(
    params: GetNotificationsParams,
  ): Promise<NotificationsResponse> {
    await delay(300);
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const skip = (page - 1) * limit;
    const sorted = [...mockNotifications].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return {
      data: sorted.slice(skip, skip + limit),
      total: sorted.length,
    };
  },

  async getUnreadCount(): Promise<UnreadCountResponse> {
    await delay(150);
    const count = mockNotifications.filter((n) => !n.isRead).length;
    return { count };
  },

  async markAsRead(id: number): Promise<Notification> {
    await delay(200);
    const notification = mockNotifications.find((n) => n.id === id);
    if (!notification) throw new Error("Notification not found");
    notification.isRead = true;
    notification.readAt = new Date().toISOString();
    return { ...notification };
  },

  async markAllAsRead(): Promise<MarkAllReadResponse> {
    await delay(300);
    const now = new Date().toISOString();
    let updated = 0;
    for (const n of mockNotifications) {
      if (!n.isRead) {
        n.isRead = true;
        n.readAt = now;
        updated++;
      }
    }
    return { updated };
  },

  async getPreferences(): Promise<PreferencesResponse> {
    await delay(200);
    return { data: [...mockPreferences] };
  },

  async updatePreference(
    dto: UpdateNotificationPrefsDto,
  ): Promise<NotificationPreference> {
    await delay(200);
    const existing = mockPreferences.find((p) => p.type === dto.type);
    if (existing) {
      existing.isEnabled = dto.isEnabled;
      return { ...existing };
    }
    const newPref: NotificationPreference = {
      id: nextId++,
      userId: 1,
      type: dto.type,
      isEnabled: dto.isEnabled,
    };
    mockPreferences.push(newPref);
    return { ...newPref };
  },
};
