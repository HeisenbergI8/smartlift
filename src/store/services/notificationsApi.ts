import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import { notificationsRtkConfig } from "@/configs/notificationsRtkConfig";
import { notificationsApiService } from "@/views/notifications/services/notificationsApi";
import type {
  NotificationsResponse,
  GetNotificationsParams,
  UnreadCountResponse,
  MarkAllReadResponse,
  Notification,
  PreferencesResponse,
  NotificationPreference,
  UpdateNotificationPrefsDto,
} from "@/views/notifications/types";

export const notificationsApi = createApi({
  reducerPath: notificationsRtkConfig.reducerPath,
  baseQuery: fakeBaseQuery(),
  tagTypes: notificationsRtkConfig.tagTypes,
  endpoints: (build) => ({
    getNotifications: build.query<
      NotificationsResponse,
      GetNotificationsParams
    >({
      queryFn: async (params) => {
        try {
          const data = await notificationsApiService.getNotifications(params);
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Notifications" as const,
                id,
              })),
              { type: "Notifications" as const, id: "LIST" },
            ]
          : [{ type: "Notifications" as const, id: "LIST" }],
    }),

    getUnreadCount: build.query<UnreadCountResponse, void>({
      queryFn: async () => {
        try {
          const data = await notificationsApiService.getUnreadCount();
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: [{ type: "Notifications" as const, id: "UNREAD" }],
    }),

    markAsRead: build.mutation<Notification, number>({
      queryFn: async (id) => {
        try {
          const data = await notificationsApiService.markAsRead(id);
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: (_result, _error, id) => [
        { type: "Notifications" as const, id },
        { type: "Notifications" as const, id: "LIST" },
        { type: "Notifications" as const, id: "UNREAD" },
      ],
    }),

    markAllAsRead: build.mutation<MarkAllReadResponse, void>({
      queryFn: async () => {
        try {
          const data = await notificationsApiService.markAllAsRead();
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: [
        { type: "Notifications" as const, id: "LIST" },
        { type: "Notifications" as const, id: "UNREAD" },
      ],
    }),

    getPreferences: build.query<PreferencesResponse, void>({
      queryFn: async () => {
        try {
          const data = await notificationsApiService.getPreferences();
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "NotificationPreferences" as const,
                id,
              })),
              {
                type: "NotificationPreferences" as const,
                id: "LIST",
              },
            ]
          : [{ type: "NotificationPreferences" as const, id: "LIST" }],
    }),

    updatePreference: build.mutation<
      NotificationPreference,
      UpdateNotificationPrefsDto
    >({
      queryFn: async (dto) => {
        try {
          const data = await notificationsApiService.updatePreference(dto);
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      invalidatesTags: [
        { type: "NotificationPreferences" as const, id: "LIST" },
        { type: "Notifications" as const, id: "UNREAD" },
      ],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useGetPreferencesQuery,
  useUpdatePreferenceMutation,
} = notificationsApi;
