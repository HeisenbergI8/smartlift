import { fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const personalRecordsRtkConfig = {
  reducerPath: "personalRecordsApi" as const,
  baseQuery: fakeBaseQuery(),
  tagTypes: ["PersonalRecords"] as const,
};
