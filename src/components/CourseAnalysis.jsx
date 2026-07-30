import { useEffect, useState } from "react";
import { getTournamentStats } from "../services/golfApi";
import { getCourseDNA } from "../data/courseDNA";
import { calculateCourseFit } from "../utils/courseFit";
import { getAllPlayers } from "../services/statsService";

export default function CourseAnalysis({ tournament, onBack }) {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState(0);
  const [topFits, setTopFits] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const dna = getCourseDNA(tournament.course_name);

        const stats = await getTournamentStats(tournament.id);
        const rounds = stats.data ?? [];

        setRecords(rounds.length);

        const players = await getAllPlayers("starts");

        const ranked = players
          .map((player) => ({
            ...player,
            fit: calculateCourseFit(player, dna),
          }))
          .filter((p) => p.fit)
          .sort((a, b) => b.fit.score - a.fit.score)
          .slice(0, 10);

        setTopFits(ranked);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [tournament]);

  const dna = getCourseDNA(tournament.course_name);

  return (
    <div className="p-6 text-white">

      <button
        onClick={onBack}
        className="mb-6 rounded-xl bg-green-500 px-5 py-3 font-bold text-slate-900 hover:bg-green-400"
      >
        ← Back
      </button>

      <h1 className="text-4xl font-bold text-green-400">
        {tournament.name}
      </h1>

      <p className="mt-2 text-slate-400 text-lg">
        {tournament.course_name || "Unknown Course"}
      </p>

      {loading ? (
        <div className="mt-10 rounded-xl bg-slate-900 p-8">
          Loading historical data...
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">

            <div className="rounded-xl bg-slate-900 p-6">

              <h2 className="mb-5 text-2xl font-bold">
                🧬 Course DNA
              </h2>

              {Object.entries(dna).map(([key, value]) => (
                <div
                  key={key}
                  className="mb-3 flex justify-between border-b border-slate-700 pb-2"
                >
                  <span className="capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>

                  <span className="font-bold text-green-400">
                    {value}%
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-slate-900 p-6">

              <h2 className="mb-5 text-2xl font-bold">
                📊 Historical Data
              </h2>

              <div className="text-5xl font-bold text-green-400">
                {records}
              </div>

              <p className="mt-3 text-slate-400">
                Player records analysed
              </p>
            </div>

          </div>

          <div className="mt-10 rounded-xl bg-slate-900 p-6">

            <h2 className="mb-6 text-2xl font-bold">
              🏆 Top Course Fits
            </h2>

            <table className="min-w-full">

              <thead>

                <tr className="border-b border-slate-700">

                  <th className="py-3 text-left">
                    Rank
                  </th>

                  <th className="py-3 text-left">
                    Player
                  </th>

                  <th className="py-3 text-right">
                    Course Fit
                  </th>

                  <th className="py-3 text-right">
                    Recommendation
                  </th>

                </tr>

              </thead>

              <tbody>

                {topFits.map((player, index) => (
                  <tr
                    key={player.player.id}
                    className="border-b border-slate-800"
                  >
                    <td className="py-3 font-bold text-green-400">
                      #{index + 1}
                    </td>

                    <td className="py-3">
                      {player.player.first_name}{" "}
                      {player.player.last_name}
                    </td>

                    <td className="py-3 text-right font-bold">
                      {player.fit.score}
                    </td>

                    <td className="py-3 text-right text-cyan-400">
                      {player.fit.recommendation}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        </>
      )}
    </div>
  );
}