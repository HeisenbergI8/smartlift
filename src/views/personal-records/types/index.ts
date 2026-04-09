export type RecordType = "max_weight" | "max_reps" | "max_volume";

export type PersonalRecord = {
  id: number;
  userId: number;
  exerciseId: number;
  recordType: RecordType;
  value: number;
  workoutSetId: number;
  achievedAt: string;
  exercise: {
    id: number;
    name: string;
  };
};

export type PersonalRecordsResponse = {
  data: PersonalRecord[];
};

export type GetPersonalRecordsParams = {
  exerciseId?: number;
};
