import { apiClient } from "@/libs/apiClient";
import type {
  EvaluateProgressionResponse,
  GetProgressionHistoryByExerciseParams,
  GetProgressionHistoryParams,
  ProgressionHistoryResponse,
  ProgressionSettings,
  UpdateProgressionSettingsDto,
} from "../types";

export const progressionApiService = {
  async getSettings(): Promise<ProgressionSettings> {
    return apiClient.get<ProgressionSettings>("/progression/settings");
  },

  async upsertSettings(
    dto: UpdateProgressionSettingsDto,
  ): Promise<ProgressionSettings> {
    return apiClient.put<ProgressionSettings>("/progression/settings", dto);
  },

  async getHistory(
    params: GetProgressionHistoryParams,
  ): Promise<ProgressionHistoryResponse> {
    return apiClient.get<ProgressionHistoryResponse>("/progression/history", {
      params,
    });
  },

  async getHistoryByExercise(
    params: GetProgressionHistoryByExerciseParams,
  ): Promise<ProgressionHistoryResponse> {
    return apiClient.get<ProgressionHistoryResponse>(
      `/progression/history/exercise/${params.exerciseId}`,
      { params: { page: params.page, limit: params.limit } },
    );
  },

  async evaluateProgression(): Promise<EvaluateProgressionResponse> {
    return apiClient.post<EvaluateProgressionResponse>(
      "/progression/evaluate",
      {},
    );
  },
};
