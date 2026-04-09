import { useState } from "react";

import { useGetPersonalRecordsQuery } from "@/store/services/personalRecordsApi";
import type { PersonalRecord, RecordType } from "../types";

export function usePersonalRecordsActions() {
  const [exerciseIdFilter, setExerciseIdFilter] = useState<number | "">("");

  const { data, isLoading, isFetching } = useGetPersonalRecordsQuery();

  const allRecords: PersonalRecord[] = data?.data ?? [];

  const filteredRecords =
    exerciseIdFilter !== ""
      ? allRecords.filter((r) => r.exerciseId === exerciseIdFilter)
      : allRecords;

  const handleExerciseFilter = (value: number | "") => {
    setExerciseIdFilter(value);
  };

  return {
    records: filteredRecords,
    isLoading,
    isFetching,
    exerciseIdFilter,
    handleExerciseFilter,
  };
}

export type { RecordType };
