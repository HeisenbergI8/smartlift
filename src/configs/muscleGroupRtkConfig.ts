import { fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const muscleGroupRtkConfig = {
  reducerPath: "muscleGroupApi" as const,
  baseQuery: fakeBaseQuery(),
  tagTypes: ["MuscleGroups"] as const,
};
