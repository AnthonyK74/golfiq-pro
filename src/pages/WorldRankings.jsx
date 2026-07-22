import { useNavigate } from "react-router-dom";
import rankings from "../data/rankings";

export default function WorldRankings() {
  const navigate = useNavigate();

  return (
    <div className="p-10">
      <button
        onClick={() => navigate("/")}
        className="mb-8 rounded-xl bg-green-500 px-5 py-3 font-bold text-slate-900 shadow-lg hover:bg-green-400"
      >
        ← Back to Dashboard
      </button>

      <h1 className="mb-8 text-4xl font-bold text-green-400">
        🏆 Official World Rankings
      </h1>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr>
              <th className="p-4 text-left">Rank</th>
              <th className="p-4 text-left">Player</th>
              <th className="p-4 text-left">Country</th>
            </tr>
          </thead>

          <tbody>
            {rankings.map((player) => (
              <tr
                key={player.rank}
                className="border-t border-slate-800 hover:bg-slate-800"
              >
                <td className="p-4 font-bold text-green-400">
                  {player.rank}
                </td>

                <td className="p-4 font-semibold">
                  {player.name}
                </td>

                <td className="p-4 text-slate-300">
                  {player.country}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-sm text-slate-500">
        Currently displaying sample data. Live rankings will be connected next.
      </p>
    </div>
  );
}