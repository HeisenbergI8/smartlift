import { fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const nutritionRtkConfig = {
  reducerPath: "nutritionApi" as const,
  baseQuery: fakeBaseQuery(),
  tagTypes: [
    "NutritionActive",
    "NutritionHistory",
    "NutritionDailyLogs",
    "NutritionAdjustments",
  ] as const,
};
