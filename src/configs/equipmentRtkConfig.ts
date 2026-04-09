import { fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const equipmentRtkConfig = {
  reducerPath: "equipmentApi" as const,
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Equipment", "UserEquipment"] as const,
};
