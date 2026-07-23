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
        const ranked = rankTournament(data).slice(0, 20);

        setPlayers(ranked);
      } catch (err) {
        console.error(err);
        setError("Unable to load tournament predictions.");
      } finally {
        setLoading(false);
      }
    }

    loadPredictions();
  }, []);

  const favourite = players[0];

  function medal(rank) {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  }

  function confidence(win) {
    if (win >= 25) return "★★★★★";
    if (win >= 20) return "★★★★☆";
    if (win >= 15) return "★★★☆☆";
    if (win >= 10) return "★★☆☆☆";
    return "★☆☆☆☆";
  }

  return (
    <div className="mx-auto max-w-7xl">

      <button
        onClick={() => navigate("/")}
        className="mb-8 rounded-xl bg-green-500 px-5 py-3 font-bold text-slate-900 hover:bg-green-400"
      >
        ← Dashboard
      </button>

      <h1 className="text-4xl font-bold text-green-400">
        🏆 Tournament Predictor
      </h1>

      <p className="mb-10 mt-2 text-slate-400">
        Live GolfIQ predictions using current form and analytics.
      </p>

      {loading && (
        <div className="rounded-xl bg-slate-900 p-10 text-center">
          Loading predictions...
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-600 bg-red-950/30 p-6 text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && favourite && (
        <>
          <div className="mb-10 rounded-2xl border border-green-500 bg-slate-900 p-8">

            <div className="text-sm uppercase tracking-widest text-green-400">
              Tournament Favourite
            </div>

            <h2 className="mt-2 text-4xl font-bold">
              {favourite.player.first_name} {favourite.player.last_name}
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-6">

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

              <StatCard
                title="Confidence"
                value={confidence(favourite.prediction.win)}
              />

            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-800">

            <table className="min-w-full">

              <thead className="bg-slate-900">

                <tr>

                  <th className="px-4 py-4 text-left">
                    Rank
                  </th>

                  <th className="px-4 py-4 text-left">
  Player
</th>

<th className="px-4 py-4 text-right">
  GolfIQ
</th>

<th className="px-4 py-4 text-right">
  CGI
</th>

<th className="px-4 py-4 text-right">
  Win %
</th>

                  <th className="px-4 py-4 text-right">
                    Top 5
                  </th>

                  <th className="px-4 py-4 text-right">
                    Top 10
                  </th>

                  <th className="px-4 py-4 text-right">
                    Top 20
                  </th>

                  <th className="px-4 py-4 text-right">
                    Make Cut
                  </th>

                  <th className="px-4 py-4 text-center">
                    Confidence
                  </th>

                  <th className="px-4 py-4 text-center">
                    Trend
                  </th>

                </tr>

              </thead>

              <tbody>

                {players.map((player, index) => (

                  <tr
  key={player.player.id}
  onClick={() => navigate(`/player/${player.player.id}`)}
  className="cursor-pointer border-t border-slate-800 hover:bg-slate-900"
>

                    <td className="px-4 py-4 font-bold text-green-400">
                      {medal(index + 1)}
                    </td>

                    <td className="px-4 py-4 font-semibold">
  {player.player.first_name} {player.player.last_name}
</td>

<td className="px-4 py-4 text-right font-bold text-green-400">
  {player.golfIQ.rating.toFixed(1)}
</td>

<td className="px-4 py-4 text-right">
  {player.averages.cgi.toFixed(2)}
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
                      {confidence(player.prediction.win)}
                    </td>

                    <td className="px-4 py-4 text-center text-xl">
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