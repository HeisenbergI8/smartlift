import { apiClient } from "@/libs/apiClient";
import type {
  MilestonesResponse,
  UserMilestonesResponse,
  CheckMilestonesResponse,
} from "../types";

export const milestonesApiService = {
  async getAllMilestones(): Promise<MilestonesResponse> {
    return apiClient.get<MilestonesResponse>("/milestones");
  },

  async getUserMilestones(): Promise<UserMilestonesResponse> {
    return apiClient.get<UserMilestonesResponse>("/milestones/me");
  },

  async checkAndAwardMilestones(): Promise<CheckMilestonesResponse> {
    return apiClient.post<CheckMilestonesResponse>("/milestones/check");
  },
};
