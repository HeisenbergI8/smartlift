import { fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const dashboardRtkConfig = {
  reducerPath: "dashboardApi" as const,
  baseQuery: fakeBaseQuery(),
  tagTypes: [
    "DashboardOverview",
    "DashboardStrength",
    "DashboardWeightTrend",
    "DashboardConsistency",
    "DashboardNutritionAdherence",
    "DashboardKpiSnapshots",
  ] as const,
};
