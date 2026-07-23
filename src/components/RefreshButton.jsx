import { useState } from "react";
import { refreshStatistics } from "../services/statsService";

export default function RefreshButton({ onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(
    new Date().toLocaleTimeString()
  );

  async function handleRefresh() {
    try {
      setLoading(true);

      refreshStatistics();

      if (onRefresh) {
        await onRefresh();
      }

      setLastUpdated(
        new Date().toLocaleTimeString()
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4">

      <button
        onClick={handleRefresh}
        disabled={loading}
        className="rounded-xl bg-green-500 px-5 py-3 font-bold text-slate-900 transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Refreshing..." : "🔄 Refresh Data"}
      </button>

      <div className="text-sm text-slate-400">
        Last Updated
        <div className="font-semibold text-white">
          {lastUpdated}
        </div>
      </div>

      <div className="text-sm text-slate-400">
        Data Source
        <div className="font-semibold text-green-400">
          Ball Don't Lie PGA
        </div>
      </div>

      <div className="text-sm text-slate-400">
        Cache
        <div className="font-semibold text-amber-400">
          Auto Refresh
        </div>
      </div>

    </div>
  );
}