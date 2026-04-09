import { fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const notificationsRtkConfig = {
  reducerPath: "notificationsApi" as const,
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Notifications", "NotificationPreferences"] as const,
};
