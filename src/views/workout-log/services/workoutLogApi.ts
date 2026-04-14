import { apiClient } from "@/libs/apiClient";
import type {
  CompleteSessionDto,
  GetSessionsParams,
  LogSetDto,
  SessionsResponse,
  StartSessionDto,
  WorkoutSession,
  WorkoutSet,
} from "../types";

export const workoutLogApiService = {
  findAll: async (params: GetSessionsParams): Promise<SessionsResponse> => {
    return apiClient.get<SessionsResponse>("/workout-sessions", {
      params: {
        page: params.page,
        limit: params.limit,
        ...(params.status && { status: params.status }),
      },
    });
  },

  findOne: async (id: number): Promise<WorkoutSession> => {
    return apiClient.get<WorkoutSession>(`/workout-sessions/${id}`);
  },

  startSession: async (dto: StartSessionDto): Promise<WorkoutSession> => {
    return apiClient.post<WorkoutSession>("/workout-sessions", dto);
  },

  logSet: async (sessionId: number, dto: LogSetDto): Promise<WorkoutSet> => {
    return apiClient.post<WorkoutSet>(
      `/workout-sessions/${sessionId}/sets`,
      dto,
    );
  },

  completeSession: async (
    sessionId: number,
    dto: CompleteSessionDto,
  ): Promise<WorkoutSession> => {
    return apiClient.patch<WorkoutSession>(
      `/workout-sessions/${sessionId}/complete`,
      dto,
    );
  },

  deleteSession: async (id: number): Promise<void> => {
    return apiClient.delete(`/workout-sessions/${id}`);
  },
};
