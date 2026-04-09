import { fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const workoutLogRtkConfig = {
  reducerPath: "workoutLogApi" as const,
  baseQuery: fakeBaseQuery(),
  tagTypes: ["WorkoutSessions"] as const,
};
