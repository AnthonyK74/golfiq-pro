import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTournamentStatistics } from "../services/tournamentService";

export default function Leaderboard() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStatistics() {
      try {
        const data = await getTournamentStatistics(id);

        const stats = Array.isArray(data) ? data : [];

        // Sort by SG Total (highest first)
        stats.sort(
          (a, b) => Number(b.sg_total ?? 0) - Number(a.sg_total ?? 0)
        );

        setPlayers(stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadStatistics();
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 text-center text-slate-400">
        Loading Tournament Statistics...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 rounded-xl bg-green-500 px-5 py-3 font-bold text-slate-900 hover:bg-green-400"
      >
        ← Back
      </button>

      <h1 className="mb-2 text-4xl font-bold text-green-400">
        📊 Tournament Statistics
      </h1>

      <p className="mb-8 text-slate-400">
        Player performance statistics for this tournament
      </p>

      <div className="overflow-x-auto rounded-xl border border-slate-700">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3 text-left">Player</th>
              <th className="p-3 text-right">SG Total</th>
              <th className="p-3 text-right">SG OTT</th>
              <th className="p-3 text-right">SG APP</th>
              <th className="p-3 text-right">SG ARG</th>
              <th className="p-3 text-right">SG PUTT</th>
              <th className="p-3 text-right">Driving %</th>
              <th className="p-3 text-right">GIR %</th>
              <th className="p-3 text-right">Scrambling %</th>
            </tr>
          </thead>

          <tbody>
            {players.map((player, index) => (
              <tr
                key={player.player.id}
                className="border-t border-slate-800 hover:bg-slate-900"
              >
                <td className="p-3 font-bold">{index + 1}</td>

                <td className="p-3">
                  {player.player.display_name}
                </td>

                <td className="p-3 text-right font-bold text-green-400">
                  {Number(player.sg_total ?? 0).toFixed(2)}
                </td>

                <td className="p-3 text-right">
                  {Number(player.sg_off_tee ?? 0).toFixed(2)}
                </td>

                <td className="p-3 text-right">
                  {Number(player.sg_approach ?? 0).toFixed(2)}
                </td>

                <td className="p-3 text-right">
                  {Number(player.sg_around_green ?? 0).toFixed(2)}
                </td>

                <td className="p-3 text-right">
                  {Number(player.sg_putting ?? 0).toFixed(2)}
                </td>

                <td className="p-3 text-right">
                  {Number(player.driving_accuracy ?? 0).toFixed(1)}%
                </td>

                <td className="p-3 text-right">
                  {Number(player.greens_in_regulation ?? 0).toFixed(1)}%
                </td>

                <td className="p-3 text-right">
                  {Number(player.scrambling ?? 0).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
