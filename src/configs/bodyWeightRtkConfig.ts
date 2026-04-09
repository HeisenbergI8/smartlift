import { fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const bodyWeightRtkConfig = {
  reducerPath: "bodyWeightApi" as const,
  baseQuery: fakeBaseQuery(),
  tagTypes: ["BodyWeightLogs", "BodyWeightLatest", "BodyWeightWeekly"] as const,
};
