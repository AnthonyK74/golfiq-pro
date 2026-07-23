import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getLastFiveTournamentStats } from "../services/golfApi";
import { averagePlayerRatings } from "../utils/golfIQCalculator";

export default function GolfIQPowerRankings() {
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRankings() {
      try {
        const stats = await getLastFiveTournamentStats();

        const rankings = averagePlayerRatings(stats);

        setPlayers(rankings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadRankings();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-slate-400">
        Building GolfIQ Power Rankings...
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
  📈 GolfIQ Pro Power Rankings
</h1>

      <p className="mb-8 text-slate-400">
        GolfIQ Pro proprietary rankings based on performance across the last five completed PGA Tour tournaments.
      </p>

      <div className="overflow-x-auto rounded-xl border border-slate-700">

        <table className="min-w-full">

          <thead className="bg-slate-900">
            <tr>
              <th className="p-4">Rank</th>
              <th className="p-4 text-left">Player</th>
              <th className="p-4 text-right">GolfIQ</th>
              <th className="p-4 text-right">Events</th>
            </tr>
          </thead>

          <tbody>

            {players.slice(0,20).map((player,index)=>(

              <tr
                key={player.player.id}
  onClick={() => navigate(`/player/${player.player.id}`)}
  className="cursor-pointer border-t border-slate-800 transition-colors hover:bg-slate-900"
              >

                <td className="p-4 font-bold">
                  {index+1}
                </td>

                <td className="p-4">
                  {player.player.display_name}
                </td>

                <td className="p-4 text-right font-bold text-green-400">
                  {player.averageGolfIQ.toFixed(2)}
                </td>

                <td className="p-4 text-right">
                  {player.tournaments}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}