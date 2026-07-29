import { useEffect, useState } from "react";
import { getTournamentStats } from "../services/golfApi";

export default function CourseAnalysis({
  tournament,
  onBack,
}) {
  const [loading, setLoading] = useState(true);
  const [rounds, setRounds] = useState([]);

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        console.log(
          "Loading tournament:",
          tournament.id,
          tournament.name,
          tournament.season
        );

        const response = await getTournamentStats(tournament.id);

        console.log("Raw response:", response);

        const data = response.data ?? response;

        console.log("Historical data:", data);

        setRounds(data);
      } catch (err) {
        console.error(err);
        setRounds([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [tournament]);

  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="mb-6 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded"
      >
        ← Back to Tournaments
      </button>

      <h1 className="text-3xl font-bold text-green-400">
        {tournament.name}
      </h1>

      <p className="mb-6">
        {tournament.course_name}
      </p>

      {loading ? (
        <div className="text-green-400 text-lg">
          Loading historical data...
        </div>
      ) : (
        <div className="border border-green-500 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">
            Historical Analysis
          </h2>

          {rounds.length === 0 ? (
            <div className="text-yellow-400 font-medium">
              Historical statistics are unavailable for this tournament.
            </div>
          ) : (
            <p>
              Player records analysed:
              <strong> {rounds.length}</strong>
            </p>
          )}
        </div>
      )}
    </div>
  );
}