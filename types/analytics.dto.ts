export interface AiInsightDto {
  period: string;
  generatedAt: string;
  summary: string;
  topSpendingCategory: TopCategory | null;
  anomalies: string[];
  actionableTips: string[];
}

export interface TopCategory {
  category: string;
  percentage: number | null;
  insight: string;
}