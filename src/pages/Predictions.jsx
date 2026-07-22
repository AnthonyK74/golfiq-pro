import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLeaderboard } from "../services/statsService";

export default function Predictions() {
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPredictions() {
      try {
        setLoading(true);

        const data = await getLeaderboard("cgi", "starts");

        setPlayers(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load prediction data.");
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
        className="mb-8 rounded-xl bg-green-500 px-5 py-3 font-bold text-slate-900 transition hover:bg-green-400"
      >
        ← Back to Dashboard
      </button>

      <h1 className="mb-2 text-4xl font-bold text-green-400">
        🎯 GolfIQ Prediction Centre
      </h1>

      <p className="mb-8 text-slate-400">
        Live predictions generated from each player's five most recent starts.
      </p>

      {loading && (
        <div className="py-20 text-center text-slate-400">
          Loading predictions...
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500 bg-red-900/30 p-6">
          {error}
        </div>
      )}

      {!loading && !error && favourite && (
        <>

          <div className="mb-10 rounded-2xl border border-green-500 bg-slate-900 p-8">

            <div className="mb-2 text-sm uppercase tracking-widest text-green-400">
              Tournament Favourite
            </div>

            <h2 className="mb-6 text-3xl font-bold">
              {favourite.player.first_name} {favourite.player.last_name}
            </h2>

            <div className="grid gap-6 md:grid-cols-4">

              <div className="rounded-xl bg-slate-950 p-5">
                <div className="text-sm text-slate-400">
                  Prediction Score
                </div>

                <div className="mt-2 text-3xl font-bold text-green-400">
                  {favourite.predictionScore.toFixed(1)}
                </div>
              </div>

              <div className="rounded-xl bg-slate-950 p-5">
                <div className="text-sm text-slate-400">
                  Confidence
                </div>

                <div className="mt-2 text-3xl font-bold text-green-400">
                  {favourite.confidence}%
                </div>
              </div>

              <div className="rounded-xl bg-slate-950 p-5">
                <div className="text-sm text-slate-400">
                  CGI
                </div>

                <div className="mt-2 text-3xl font-bold text-green-400">
                  {favourite.averages.cgi.toFixed(2)}
                </div>
              </div>

              <div className="rounded-xl bg-slate-950 p-5">
                <div className="text-sm text-slate-400">
                  Form
                </div>

                <div className="mt-2 text-2xl font-bold">
                  {favourite.trend}
                </div>
              </div>

            </div>

          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">

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
                    Prediction
                  </th>

                  <th className="px-4 py-4 text-right">
                    Confidence
                  </th>

                  <th className="px-4 py-4 text-right">
                    CGI
                  </th>

                  <th className="px-4 py-4 text-right">
                    OTT
                  </th>

                  <th className="px-4 py-4 text-right">
                    APP
                  </th>

                  <th className="px-4 py-4 text-right">
                    ARG
                  </th>

                  <th className="px-4 py-4 text-right">
                    PUTT
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
                    className="border-t border-slate-800 transition hover:bg-slate-900"
                  >

                    <td className="px-4 py-4 text-xl font-bold text-green-400">

                      {medal(index + 1)}

                    </td>

                    <td className="px-4 py-4 font-semibold">

                      {player.player.first_name}{" "}
                      {player.player.last_name}

                    </td>

                    <td className="px-4 py-4 text-right">

                      {player.predictionScore.toFixed(1)}

                    </td>

                    <td className="px-4 py-4 text-right font-bold text-green-400">

                      {player.confidence}%

                    </td>

                    <td className="px-4 py-4 text-right">

                      {player.averages.cgi.toFixed(2)}

                    </td>

                    <td className="px-4 py-4 text-right">

                      {player.averages.sg_off_tee.toFixed(2)}

                    </td>

                    <td className="px-4 py-4 text-right">

                      {player.averages.sg_approach.toFixed(2)}

                    </td>

                    <td className="px-4 py-4 text-right">

                      {player.averages.sg_around_green.toFixed(2)}

                    </td>

                    <td className="px-4 py-4 text-right">

                      {player.averages.sg_putting.toFixed(2)}

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