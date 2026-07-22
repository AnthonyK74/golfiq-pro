import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPlayers } from "../services/statsService";
import { rankTournament } from "../utils/tournamentPredictor";

export default function TournamentPredictor() {
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPredictions() {
      try {
        setLoading(true);

        const data = await getAllPlayers("starts");
        setPlayers(rankTournament(data).slice(0, 20));
      } catch (err) {
        console.error(err);
        setError("Unable to load tournament predictions.");
      } finally {
        setLoading(false);
      }
    }

    loadPredictions();
  }, []);

  function medal(rank) {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  }

  const favourite = players[0];

  return (
    <div className="mx-auto max-w-7xl">

      <button
        onClick={() => navigate("/")}
        className="mb-8 rounded-xl bg-green-500 px-5 py-3 font-bold text-slate-900 hover:bg-green-400"
      >
        ← Back to Dashboard
      </button>

      <h1 className="mb-2 text-4xl font-bold text-green-400">
        🏆 Tournament Predictor
      </h1>

      <p className="mb-8 text-slate-400">
        GolfIQ combines current form, strokes gained analytics and course fit
        to rank the strongest contenders.
      </p>

      {loading && (
        <div className="py-20 text-center text-slate-400">
          Loading predictions...
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

            <div className="text-sm uppercase tracking-widest text-green-400">
              Tournament Favourite
            </div>

            <h2 className="mt-2 text-3xl font-bold">
              {favourite.player.first_name}{" "}
              {favourite.player.last_name}
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-5">

              <StatCard
                title="Win %"
                value={`${favourite.prediction.win}%`}
              />

              <StatCard
                title="Top 5"
                value={`${favourite.prediction.top5}%`}
              />

              <StatCard
                title="Top 10"
                value={`${favourite.prediction.top10}%`}
              />

              <StatCard
                title="Top 20"
                value={`${favourite.prediction.top20}%`}
              />

              <StatCard
                title="Make Cut"
                value={`${favourite.prediction.makeCut}%`}
              />

            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">

            <table className="min-w-full">

              <thead className="bg-slate-900">

                <tr>
                  <th className="px-4 py-4 text-left">Rank</th>
                  <th className="px-4 py-4 text-left">Player</th>
                  <th className="px-4 py-4 text-right">Win %</th>
                  <th className="px-4 py-4 text-right">Top 5</th>
                  <th className="px-4 py-4 text-right">Top 10</th>
                  <th className="px-4 py-4 text-right">Top 20</th>
                  <th className="px-4 py-4 text-right">Make Cut</th>
                  <th className="px-4 py-4 text-center">Form</th>
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
                      {player.player.first_name}{" "}
                      {player.player.last_name}
                    </td>

                    <td className="px-4 py-4 text-right">
                      {player.prediction.win}%
                    </td>

                    <td className="px-4 py-4 text-right">
                      {player.prediction.top5}%
                    </td>

                    <td className="px-4 py-4 text-right">
                      {player.prediction.top10}%
                    </td>

                    <td className="px-4 py-4 text-right">
                      {player.prediction.top20}%
                    </td>

                    <td className="px-4 py-4 text-right">
                      {player.prediction.makeCut}%
                    </td>

                    <td className="px-4 py-4 text-center">
                      {player.trend}
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

function StatCard({ title, value }) {
  return (
    <div className="rounded-xl bg-slate-950 p-5">
      <div className="text-sm text-slate-400">
        {title}
      </div>

      <div className="mt-2 text-3xl font-bold text-green-400">
        {value}
      </div>
    </div>
  );
}