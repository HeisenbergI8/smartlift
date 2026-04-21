import { apiClient } from "@/libs/apiClient";
import type {
  BodyWeightLog,
  BodyWeightLogsResponse,
  GetBodyWeightLogsParams,
  GetWeeklyAveragesParams,
  LogBodyWeightDto,
  WeeklyAverage,
} from "../types";

export const bodyWeightApiService = {
  getLogs: async (
    params?: GetBodyWeightLogsParams,
  ): Promise<BodyWeightLogsResponse> => {
    return apiClient.get<BodyWeightLogsResponse>("/body-weight", {
      params: params as Record<string, string | number | undefined>,
    });
  },

  getLatest: async (): Promise<BodyWeightLog | null> => {
    return apiClient.get<BodyWeightLog | null>("/body-weight/latest");
  },

  getWeeklyAverages: async (
    params?: GetWeeklyAveragesParams,
  ): Promise<WeeklyAverage[]> => {
    return apiClient.get<WeeklyAverage[]>("/body-weight/weekly-averages", {
      params: params as Record<string, string | number | undefined>,
    });
  },

  logWeight: async (dto: LogBodyWeightDto): Promise<BodyWeightLog> => {
    return apiClient.post<BodyWeightLog>("/body-weight", dto);
  },

  deleteLog: async (id: number): Promise<void> => {
    await apiClient.delete(`/body-weight/${id}`);
  },
};
