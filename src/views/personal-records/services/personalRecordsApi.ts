import type { PersonalRecord, PersonalRecordsResponse } from "../types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const daysAgo = (d: number) =>
  new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString();

const mockRecords: PersonalRecord[] = [
  {
    id: 1,
    userId: 1,
    exerciseId: 2,
    recordType: "max_weight",
    value: 150,
    workoutSetId: 3,
    achievedAt: daysAgo(2),
    exercise: { id: 2, name: "Barbell Back Squat" },
  },
  {
    id: 2,
    userId: 1,
    exerciseId: 2,
    recordType: "max_reps",
    value: 12,
    workoutSetId: 10,
    achievedAt: daysAgo(14),
    exercise: { id: 2, name: "Barbell Back Squat" },
  },
  {
    id: 3,
    userId: 1,
    exerciseId: 2,
    recordType: "max_volume",
    value: 1650,
    workoutSetId: 3,
    achievedAt: daysAgo(2),
    exercise: { id: 2, name: "Barbell Back Squat" },
  },
  {
    id: 4,
    userId: 1,
    exerciseId: 1,
    recordType: "max_weight",
    value: 100,
    workoutSetId: 6,
    achievedAt: daysAgo(7),
    exercise: { id: 1, name: "Barbell Bench Press" },
  },
  {
    id: 5,
    userId: 1,
    exerciseId: 1,
    recordType: "max_reps",
    value: 15,
    workoutSetId: 7,
    achievedAt: daysAgo(21),
    exercise: { id: 1, name: "Barbell Bench Press" },
  },
  {
    id: 6,
    userId: 1,
    exerciseId: 3,
    recordType: "max_weight",
    value: 200,
    workoutSetId: 4,
    achievedAt: daysAgo(2),
    exercise: { id: 3, name: "Conventional Deadlift" },
  },
  {
    id: 7,
    userId: 1,
    exerciseId: 3,
    recordType: "max_volume",
    value: 600,
    workoutSetId: 4,
    achievedAt: daysAgo(2),
    exercise: { id: 3, name: "Conventional Deadlift" },
  },
];

export const personalRecordsApiService = {
  async getPersonalRecords(): Promise<PersonalRecordsResponse> {
    await delay(300);
    return { data: mockRecords };
  },

  async getPersonalRecordsByExercise(
    exerciseId: number,
  ): Promise<PersonalRecordsResponse> {
    await delay(200);
    return {
      data: mockRecords.filter((r) => r.exerciseId === exerciseId),
    };
  },
};
