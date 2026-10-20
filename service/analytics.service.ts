
import { AiInsightDto } from "@/types/analytics.dto";
import { apiClient } from "./apiClient";

export const analyticsService = {
  async getAiInsights() {
    return await apiClient<AiInsightDto>('/ai/insights');
  },

  async generateAiInsights() {
    return await apiClient<AiInsightDto>('/ai/insights/generate', { method: 'POST' });
  },
};