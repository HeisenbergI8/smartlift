import { fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const exerciseRtkConfig = {
  reducerPath: "exerciseApi" as const,
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Exercises"] as const,
};
