import { CategoryBreakdownDto, MonthlyTrendDto, SummaryDto } from "@/types/dashboard.dto";
import { apiClient } from "./apiClient";

export const dashboardService = {
  async getCategoryBreakdown() {
    return await apiClient<CategoryBreakdownDto[]>('/dashboard/category-breakdown');
  },

  async getDashboardSummary() {
    return await apiClient<SummaryDto>('/dashboard/summary');
  },

  async getMonthlyTrend() {
    return await apiClient<MonthlyTrendDto[]>('/dashboard/monthly-trend');
  },

}