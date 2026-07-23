import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTournamentStats } from "../services/golfApi";

export default function GolfIQRankings() {

  const navigate = useNavigate();
  const { id } = useParams();

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRankings() {
      try {
       const response = await getTournamentStats(id);

console.log("Response:", response);
console.log("Response.data:", response.data);

        let data = [];

        if (Array.isArray(response)) {
          data = response;
        } else if (Array.isArray(response.data)) {
          data = response.data;
        }

        const rankings = data.map((player) => {
          const sgOtt = Number(player.sg_off_tee ?? 0);
          const sgApp = Number(player.sg_approach ?? 0);
          const sgArg = Number(player.sg_around_green ?? 0);
          const sgPutt = Number(player.sg_putting ?? 0);

          const golfIQ =
            (1.5 * sgApp) +
            (1.2 * sgOtt) +
            (1.0 * sgPutt) +
            (0.8 * sgArg);

          return {
            ...player,
            golfIQ,
          };
        });

        rankings.sort((a, b) => b.golfIQ - a.golfIQ);
console.log("Data length:", data.length);
console.log("Rankings:", rankings.length);
        setPlayers(rankings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadRankings();
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 text-center text-slate-400">
        Loading GolfIQ Rankings...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-8">

      <button
        onClick={() => navigate(-1)}
        className="mb-6 rounded-xl bg-green-500 px-5 py-3 font-bold text-slate-900"
      >
        ← Back
      </button>

      <h1 className="mb-2 text-4xl font-bold text-green-400">
        ⭐ GolfIQ Rankings
      </h1>

      <p className="mb-8 text-slate-400">
        Custom rankings based on your GolfIQ formula
      </p>

      <div className="overflow-x-auto rounded-xl border border-slate-700">

        <table className="min-w-full text-sm">

          <thead className="bg-slate-900">
            <tr>
              <th className="p-3">Rank</th>
              <th className="p-3 text-left">Player</th>
              <th className="p-3 text-right">GolfIQ</th>
              <th className="p-3 text-right">SG OTT</th>
              <th className="p-3 text-right">SG APP</th>
              <th className="p-3 text-right">SG ARG</th>
              <th className="p-3 text-right">SG PUTT</th>
            </tr>
          </thead>

          <tbody>
            {players.map((player, index) => (
              <tr
                key={player.player.id}
                className={`border-t border-slate-800 ${
                  index < 20 ? "bg-green-950/20" : ""
                }`}
              >
                <td className="p-3 font-bold">{index + 1}</td>

                <td className="p-3 font-medium">
                  {player.player.display_name}
                </td>

                <td className="p-3 text-right font-bold text-yellow-400">
                  {player.golfIQ.toFixed(2)}
                </td>

                <td className="p-3 text-right">
                  {player.sg_off_tee.toFixed(2)}
                </td>

                <td className="p-3 text-right">
                  {player.sg_approach.toFixed(2)}
                </td>

                <td className="p-3 text-right">
                  {player.sg_around_green.toFixed(2)}
                </td>

                <td className="p-3 text-right">
                  {player.sg_putting.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}