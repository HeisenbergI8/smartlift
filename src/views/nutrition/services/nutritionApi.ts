import { apiClient } from "@/libs/apiClient";
import type {
  CreateNutritionRecommendationDto,
  DailyNutritionLog,
  DailyNutritionLogsResponse,
  GetDailyLogsParams,
  LogDailyNutritionDto,
  NutritionAdjustment,
  NutritionAdjustmentsResponse,
  NutritionRecommendation,
  PlateauDetectResult,
} from "../types";

export const nutritionApiService = {
  async getActiveRecommendation(): Promise<NutritionRecommendation | null> {
    try {
      return await apiClient.get<NutritionRecommendation>(
        "/nutrition/recommendation",
      );
    } catch (err) {
      if (
        (err as Error).message === "No active nutrition recommendation found"
      ) {
        return null;
      }
      throw err;
    }
  },

  async createRecommendation(
    dto: CreateNutritionRecommendationDto,
  ): Promise<NutritionRecommendation> {
    return apiClient.post<NutritionRecommendation>(
      "/nutrition/recommendation",
      dto,
    );
  },

  async generateRecommendation(): Promise<NutritionRecommendation> {
    return apiClient.post<NutritionRecommendation>(
      "/nutrition/recommendation/generate",
    );
  },
};

export const dailyNutritionApiService = {
  async getDailyLogs(
    params?: GetDailyLogsParams,
  ): Promise<DailyNutritionLogsResponse> {
    return apiClient.get<DailyNutritionLogsResponse>("/nutrition/daily-logs", {
      params: {
        startDate: params?.startDate,
        endDate: params?.endDate,
      },
    });
  },

  async logDailyNutrition(
    dto: LogDailyNutritionDto,
  ): Promise<DailyNutritionLog> {
    return apiClient.post<DailyNutritionLog>("/nutrition/daily-log", dto);
  },

  async getAdjustmentHistory(): Promise<NutritionAdjustmentsResponse> {
    return apiClient.get<NutritionAdjustmentsResponse>(
      "/nutrition/adjustments",
    );
  },

  async detectPlateau(): Promise<PlateauDetectResult> {
    return apiClient.post<PlateauDetectResult>("/nutrition/detect-plateau");
  },
};
