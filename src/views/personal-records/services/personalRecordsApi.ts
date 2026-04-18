import { apiClient } from "@/libs/apiClient";
import type { PersonalRecord, PersonalRecordsResponse } from "../types";

function mapServerRecord(raw: any): PersonalRecord {
  return {
    id: Number(raw.id),
    userId: Number(raw.userId),
    exerciseId: Number(raw.exerciseId),
    recordType: raw.recordType,
    value: typeof raw.value === "string" ? parseFloat(raw.value) : raw.value,
    workoutSetId: raw.workoutSetId
      ? Number(raw.workoutSetId)
      : raw.workoutSetId,
    achievedAt: raw.achievedAt,
    exercise: {
      id: raw.exercise?.id ?? raw.exerciseId,
      name: raw.exercise?.name ?? "",
    },
  };
}

export const personalRecordsApiService = {
  async getPersonalRecords(): Promise<PersonalRecordsResponse> {
    const data = await apiClient.get<any[]>("/personal-records");
    return { data: data.map(mapServerRecord) };
  },

  async getPersonalRecordsByExercise(
    exerciseId: number,
  ): Promise<PersonalRecordsResponse> {
    const data = await apiClient.get<any[]>(
      `/personal-records/exercise/${exerciseId}`,
    );
    return { data: data.map(mapServerRecord) };
  },
};
