import { useEffect, useState } from "react";
import { getLeaderboard } from "../services/statsService";

const stats = [
  {
    label: "🏌️ Off The Tee",
    field: "sg_off_tee",
  },
  {
    label: "🎯 Approach",
    field: "sg_approach",
  },
  {
    label: "🌱 Around Green",
    field: "sg_around_green",
  },
  {
    label: "⛳ Putting",
    field: "sg_putting",
  },
  {
    label: "⭐ CGI",
    field: "cgi",
  },
];

export default function Statistics({ setPage }) {
  const [selectedStat, setSelectedStat] = useState(stats[0]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        setLoading(true);

        const leaderboard = await getLeaderboard(
          selectedStat.field
        );

        setPlayers(leaderboard);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();
  }, [selectedStat]);

  return (
    <div className="p-10">

      <button
        onClick={() => setPage("dashboard")}
        className="mb-8 rounded-xl bg-green-500 px-5 py-3 font-bold text-slate-900 hover:bg-green-400"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-4xl font-bold text-green-400 mb-8">
        📊 GolfIQ Statistics
      </h1>

      <div className="flex flex-wrap gap-3 mb-8">
        {stats.map((stat) => (
          <button
            key={stat.field}
            onClick={() => setSelectedStat(stat)}
            className={`rounded-lg px-5 py-2 font-bold transition ${
              selectedStat.field === stat.field
                ? "bg-green-500 text-slate-900"
                : "bg-slate-800 text-white hover:bg-slate-700"
            }`}
          >
            {stat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-slate-400 text-lg">
          Loading statistics...
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-700">

          <table className="w-full">

            <thead className="bg-green-600 text-slate-900">

              <tr>
                <th className="p-4">Rank</th>
                <th className="p-4 text-left">Player</th>
                <th className="p-4">Country</th>
                <th className="p-4">Events</th>
                <th className="p-4 text-right">Average</th>
              </tr>

            </thead>

            <tbody>

              {players.map((player, index) => (

                <tr
                  key={player.id}
                  className="border-b border-slate-800 hover:bg-slate-900"
                >

                  <td className="p-4 text-center font-bold">

                    {index === 0
                      ? "🥇"
                      : index === 1
                      ? "🥈"
                      : index === 2
                      ? "🥉"
                      : index + 1}

                  </td>

                  <td className="p-4 font-semibold">
                    {player.name}
                  </td>

                  <td className="p-4 text-center">
                    {player.country ?? "-"}
                  </td>

                  <td className="p-4 text-center">
                    {player.tournaments}
                  </td>

                  <td
                    className={`p-4 text-right font-bold ${
                      player.average >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {player.average.toFixed(2)}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}