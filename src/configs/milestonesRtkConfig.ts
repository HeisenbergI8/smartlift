import { fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const milestonesRtkConfig = {
  reducerPath: "milestonesApi" as const,
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Milestones", "UserMilestones"] as const,
};
