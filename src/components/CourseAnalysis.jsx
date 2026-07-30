import { useEffect, useState } from "react";
import { getTournamentStats } from "../services/golfApi";

export default function CourseAnalysis({ tournament, onBack }) {
  const [loading, setLoading] = useState(true);
  const [rounds, setRounds] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const response = await getTournamentStats(tournament.id);

        setRounds(response.data ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [tournament]);

  return (
    <div className="p-6 text-white">
      <button
        onClick={onBack}
        className="mb-6 rounded bg-green-500 px-4 py-2 font-bold text-black"
      >
        ← Back
      </button>

      <h1 className="mb-2 text-3xl font-bold text-green-400">
        {tournament.name}
      </h1>

      <p className="mb-6 text-slate-400">
        {tournament.course_name}
      </p>

      {loading ? (
        <p className="text-green-400">
          Loading historical data...
        </p>
      ) : (
        <>
          <div className="rounded-xl bg-slate-900 p-6">
            <h2 className="mb-2 text-xl font-bold">
              Historical Statistics
            </h2>

            <p>
              Player records analysed: <strong>{rounds.length}</strong>
            </p>

            {rounds.length === 0 && (
              <p className="mt-3 text-yellow-400">
                Historical statistics are unavailable for this tournament.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}