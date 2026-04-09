import { fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const userProfileRtkConfig = {
  reducerPath: "userProfileApi" as const,
  baseQuery: fakeBaseQuery(),
  tagTypes: ["UserProfile"] as const,
};
