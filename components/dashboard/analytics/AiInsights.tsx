"use client";
import { analyticsService } from "@/service/analytics.service";
import { AiInsightDto } from "@/types/analytics.dto";
import { Sparkles, RefreshCw, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { useState, useEffect } from "react";


export default function AiInsights() {
  const [insight, setInsight] = useState<AiInsightDto | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchInsights = () => {
    setLoading(true);
    analyticsService
      .getAiInsights()
      .then((data) => {
        if (data) setInsight(data);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  const handleGenerate = () => {
    setLoading(true);
    analyticsService
      .generateAiInsights()
      .then((data) => {
        if (data) setInsight(data);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">AI Financial Insights</h2>
            <p className="text-xs text-zinc-400">Personalized intelligence on your spending patterns</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {insight?.period && (
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300">
              {insight.period}
            </span>
          )}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4 py-4 animate-pulse">
          <div className="h-16 bg-zinc-950/70 border border-zinc-800 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-36 bg-zinc-950/70 border border-zinc-800 rounded-xl" />
            <div className="h-36 bg-zinc-950/70 border border-zinc-800 rounded-xl" />
            <div className="h-36 bg-zinc-950/70 border border-zinc-800 rounded-xl" />
          </div>
        </div>
      ) : !insight ? (
        <div className="h-36 flex items-center justify-center text-xs text-zinc-500">
          No insights available at the moment. Add transactions to generate AI insights.
        </div>
      ) : (
        <div className="space-y-4">
          {insight.summary && (
            <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-950/20 text-zinc-200 text-sm leading-relaxed">
              <p>{insight.summary}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insight.topSpendingCategory && (
              <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                    <TrendingUp className="h-3.5 w-3.5 text-rose-400" />
                    <span>Top Spending</span>
                  </div>
                  {insight.topSpendingCategory.percentage !== null && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400">
                      {insight.topSpendingCategory.percentage.toFixed(2)}%
                    </span>
                  )}
                </div>
                <div className="text-sm font-bold text-white">
                  {insight.topSpendingCategory.category}
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {insight.topSpendingCategory.insight}
                </p>
              </div>
            )}

            {insight.anomalies && insight.anomalies.length > 0 && (
              <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Detected Anomalies</span>
                </div>
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  {insight.anomalies.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {insight.actionableTips && insight.actionableTips.length > 0 && (
              <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <Lightbulb className="h-3.5 w-3.5" />
                  <span>Actionable Tips</span>
                </div>
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  {insight.actionableTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}