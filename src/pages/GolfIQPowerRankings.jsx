import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLeaderboard } from "../services/statsService";

export default function GolfIQPowerRankings() {
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRankings() {
      try {
        const rankings = await getLeaderboard("golfiq");

setPlayers(rankings);

console.log(rankings[0]);

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

      <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-400">
  GOLFIQ POWER RANKINGS
</p>

<h1 className="mt-2 text-5xl font-extrabold text-white">
  GolfIQ Power Rankings
</h1>

<p className="mt-4 mb-8 text-xl text-slate-300">
  Our proprietary player rankings based on performance across the last five completed PGA Tour tournaments.
</p>
<div className="mb-8 rounded-xl border border-slate-800 bg-slate-900 p-5">
  <span className="font-bold">
    About GolfIQ Power Rankings:
  </span>{" "}
  These rankings combine GolfIQ analysis into one proprietary rating designed to identify the strongest all-round PGA Tour players based on their most recent tournaments.
</div>

      <div className="overflow-x-auto rounded-xl border border-slate-700">

        <table className="min-w-full">

        <thead className="border-b border-slate-700 bg-slate-900">  
  <tr>
    <th className="p-4">Rank</th>
    <th className="p-4 text-left">Player</th>
    <th className="p-4 text-right">Rating</th>
    <th className="p-4 text-center">Grade</th>
    <th className="p-4 text-right">Events</th>
  </tr>
</thead>

          <tbody>

            {players.slice(0,20).map((player,index)=>(

              <tr
  key={player.player.id}
  onClick={() => navigate(`/player/${player.player.id}`)}
  className="cursor-pointer border-t border-slate-800 transition-colors hover:bg-slate-800"
>

                <td className="p-4 font-bold">
                  {index+1}
                </td>

                <td className="p-4">
                  {player.player.display_name}
                </td>

                <td className="p-4 text-right font-bold text-green-400">
  {player.golfIQ.rating.toFixed(1)}
</td>

<td className="p-4 text-center font-bold text-yellow-400">
  {player.golfIQ.grade}
</td>

<td className="p-4 text-right">
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