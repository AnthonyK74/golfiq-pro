import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLeaderboard } from "../services/statsService";

export default function GolfIQRankings() {
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRankings() {
      try {
        const rankings = await getLeaderboard("golfiq");
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
        ⭐ GolfIQ Top 20
      </h1>

      <p className="mb-8 text-slate-400">
        Based on each player's last five tournaments
      </p>

      <div className="overflow-x-auto rounded-xl border border-slate-700">

        <table className="min-w-full text-sm">

          <thead className="bg-slate-900">
  <tr>
    <th className="p-3">Rank</th>
    <th className="p-3 text-left">Player</th>
    <th className="p-3 text-right">Rating</th>
    <th className="p-3 text-center">Grade</th>
    <th className="p-3 text-right">Events</th>
  </tr>
</thead>

     <tbody>
  {players.map((player, index) => (
    <tr
      key={player.player.id}
      className="border-t border-slate-800"
    >
      <td className="p-3 font-bold">
        {index + 1}
      </td>

      <td className="p-3 font-medium">
        {player.player.display_name}
      </td>

      <td className="p-3 text-right font-bold text-green-400">
        {player.golfIQ.rating.toFixed(1)}
      </td>

      <td className="p-3 text-center font-bold text-yellow-400">
        {player.golfIQ.grade}
      </td>

      <td className="p-3 text-right">
        {player.averages.tournaments}
      </td>
    </tr>
  ))}
</tbody>     

        </table>

      </div>

    </div>
  );
}