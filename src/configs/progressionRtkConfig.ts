import { fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const progressionRtkConfig = {
  reducerPath: "progressionApi" as const,
  baseQuery: fakeBaseQuery(),
  tagTypes: ["ProgressionSettings", "ProgressionHistory"] as const,
};
