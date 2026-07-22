import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPlayers } from "../services/statsService";
import { calculateCourseFit } from "../utils/courseFit";

export default function CourseFit() {
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCourseFit() {
      try {
        setLoading(true);

        const data = await getAllPlayers("starts");

        const ranked = data
          .map((player) => ({
            ...player,
            courseFit: calculateCourseFit(player),
          }))
          .filter((player) => player.courseFit)
          .sort(
            (a, b) =>
              b.courseFit.score - a.courseFit.score
          )
          .slice(0, 20);

        setPlayers(ranked);
      } catch (err) {
        console.error(err);
        setError("Unable to load Course Fit data.");
      } finally {
        setLoading(false);
      }
    }

    loadCourseFit();
  }, []);

  const favourite = players[0];

  function medal(rank) {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  }

  function stars(value) {
    if (value >= 90) return "⭐⭐⭐⭐⭐";
    if (value >= 80) return "⭐⭐⭐⭐☆";
    if (value >= 70) return "⭐⭐⭐☆☆";
    if (value >= 60) return "⭐⭐☆☆☆";
    return "⭐☆☆☆☆";
  }

  return (
    <div className="mx-auto max-w-7xl">

      <button
        onClick={() => navigate("/")}
        className="mb-8 rounded-xl bg-green-500 px-5 py-3 font-bold text-slate-900 hover:bg-green-400"
      >
        ← Back to Dashboard
      </button>

      <h1 className="mb-2 text-4xl font-bold text-green-400">
        🏌️ Course Fit
      </h1>

      <p className="mb-8 text-slate-400">
        Rankings generated from GolfIQ analytics using Strokes Gained and current form.
      </p>

      {loading && (
        <div className="py-20 text-center text-slate-400">
          Loading Course Fit...
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500 bg-red-900/20 p-6">
          {error}
        </div>
      )}

      {!loading && !error && favourite && (
        <>
          <div className="mb-10 rounded-2xl border border-green-500 bg-slate-900 p-8">

            <div className="mb-2 text-sm uppercase tracking-widest text-green-400">
              Best Course Fit
            </div>

            <h2 className="mb-6 text-3xl font-bold">
              {favourite.player.first_name} {favourite.player.last_name}
            </h2>

            <div className="grid gap-6 md:grid-cols-3">

              <div className="rounded-xl bg-slate-950 p-5">
                <div className="text-sm text-slate-400">
                  Course Fit Score
                </div>

                <div className="mt-2 text-4xl font-bold text-green-400">
                  {favourite.courseFit.score}
                </div>
              </div>

              <div className="rounded-xl bg-slate-950 p-5">
                <div className="text-sm text-slate-400">
                  Recommendation
                </div>

                <div className="mt-2 text-2xl font-bold text-green-400">
                  {favourite.courseFit.recommendation}
                </div>
              </div>

              <div className="rounded-xl bg-slate-950 p-5">
                <div className="text-sm text-slate-400">
                  Current Form
                </div>

                <div className="mt-2 text-2xl">
                  {favourite.trend}
                </div>
              </div>

            </div>

          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">

            <table className="min-w-full">

              <thead className="bg-slate-900">

                <tr>
                  <th className="px-4 py-4 text-left">Rank</th>
                  <th className="px-4 py-4 text-left">Player</th>
                  <th className="px-4 py-4 text-right">Score</th>
                  <th className="px-4 py-4 text-center">Driving</th>
                  <th className="px-4 py-4 text-center">Approach</th>
                  <th className="px-4 py-4 text-center">Short Game</th>
                  <th className="px-4 py-4 text-center">Putting</th>
                  <th className="px-4 py-4 text-center">Form</th>
                  <th className="px-4 py-4 text-center">Recommendation</th>
                </tr>

              </thead>

              <tbody>

                {players.map((player, index) => (

                  <tr
                    key={player.player.id}
                    className="border-t border-slate-800 hover:bg-slate-900"
                  >

                    <td className="px-4 py-4 font-bold text-green-400">
                      {medal(index + 1)}
                    </td>

                    <td className="px-4 py-4 font-semibold">
                      {player.player.first_name} {player.player.last_name}
                    </td>

                    <td className="px-4 py-4 text-right font-bold">
                      {player.courseFit.score}
                    </td>

                    <td className="px-4 py-4 text-center">
                      {stars(player.courseFit.driving)}
                    </td>

                    <td className="px-4 py-4 text-center">
                      {stars(player.courseFit.approach)}
                    </td>

                    <td className="px-4 py-4 text-center">
                      {stars(player.courseFit.shortGame)}
                    </td>

                    <td className="px-4 py-4 text-center">
                      {stars(player.courseFit.putting)}
                    </td>

                    <td className="px-4 py-4 text-center">
                      {player.trend}
                    </td>

                    <td className="px-4 py-4 text-center">
                      {player.courseFit.recommendation}
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