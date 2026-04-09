import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import { personalRecordsRtkConfig } from "@/configs/personalRecordsRtkConfig";
import { personalRecordsApiService } from "@/views/personal-records/services/personalRecordsApi";
import type {
  PersonalRecord,
  PersonalRecordsResponse,
} from "@/views/personal-records/types";

export const personalRecordsApi = createApi({
  reducerPath: personalRecordsRtkConfig.reducerPath,
  baseQuery: fakeBaseQuery(),
  tagTypes: personalRecordsRtkConfig.tagTypes,
  endpoints: (build) => ({
    getPersonalRecords: build.query<PersonalRecordsResponse, void>({
      queryFn: async () => {
        try {
          const data = await personalRecordsApiService.getPersonalRecords();
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "PersonalRecords" as const,
                id,
              })),
              { type: "PersonalRecords" as const, id: "LIST" },
            ]
          : [{ type: "PersonalRecords" as const, id: "LIST" }],
    }),

    getPersonalRecordsByExercise: build.query<PersonalRecordsResponse, number>({
      queryFn: async (exerciseId) => {
        try {
          const data =
            await personalRecordsApiService.getPersonalRecordsByExercise(
              exerciseId,
            );
          return { data };
        } catch (error) {
          return { error: { message: (error as Error).message } };
        }
      },
      providesTags: (_result, _error, exerciseId) => [
        { type: "PersonalRecords" as const, id: `EXERCISE_${exerciseId}` },
        { type: "PersonalRecords" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetPersonalRecordsQuery,
  useGetPersonalRecordsByExerciseQuery,
} = personalRecordsApi;

// Re-export type for convenience
export type { PersonalRecord };
