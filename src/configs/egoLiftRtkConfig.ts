import { fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const egoLiftRtkConfig = {
  reducerPath: "egoLiftApi" as const,
  baseQuery: fakeBaseQuery(),
  tagTypes: ["EgoLiftAlerts"] as const,
};
