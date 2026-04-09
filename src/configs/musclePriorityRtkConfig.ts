import { fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const musclePriorityRtkConfig = {
  reducerPath: "musclePriorityApi" as const,
  baseQuery: fakeBaseQuery(),
  tagTypes: ["MusclePriorities"] as const,
};
