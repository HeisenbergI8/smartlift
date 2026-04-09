import { fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const authRtkConfig = {
  reducerPath: "authApi" as const,
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Auth"] as const,
};
