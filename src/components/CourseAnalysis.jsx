import { useEffect, useMemo, useState } from "react";
import { getTournamentStats } from "../services/golfApi";
import { calculateCourseFit } from "../utils/courseFitEngine";

export default function CourseAnalysis({
  tournament,
  onBack,
}) {
  const [loading, setLoading] = useState(true);
  const [rounds, setRounds] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        console.log(
          "Loading tournament:",
          tournament.id,
          tournament.name,
          tournament.season
        );

        const response = await getTournamentStats(tournament.id);

        const data = response.data ?? response;

        console.log("Historical data:", data);

        setRounds(data);
      } catch (err) {
        console.error(err);
        setRounds([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [tournament]);

  const leaderboard = useMemo(() => {
    if (!rounds.length) return [];

    return rounds
      .map((player) => {
        const fit = calculateCourseFit([player]);

        return {
          id: player.player.id,
          name: player.player.display_name,
          overall: fit.overall,
          driving: fit.driving,
          approach: fit.approach,
          shortGame: fit.shortGame,
          putting: fit.putting,
          sgTotal: Number(player.sg_total ?? 0).toFixed(2),
        };
      })
      .sort((a, b) => b.overall - a.overall);
  }, [rounds]);

  const filteredPlayers = leaderboard.filter((player) =>
    player.name.toLowerCase().includes(search.toLowerCase())
  );

  function medal(index) {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return index + 1;
  }

  return (
    <div className="p-6 text-white">
      <button
        onClick={onBack}
        className="mb-6 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded"
      >
        ← Back to Tournaments
      </button>

      <h1 className="text-3xl font-bold text-green-400">
        {tournament.name}
      </h1>

      <p className="mb-6">
        {tournament.course_name || "Unknown Course"}
      </p>

      {loading ? (
        <div className="text-green-400 text-lg">
          Loading historical data...
        </div>
      ) : rounds.length === 0 ? (
        <div className="border border-green-500 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">
            Historical Analysis
          </h2>

          <div className="text-yellow-400 font-medium">
            Historical statistics are unavailable for this tournament.
          </div>
        </div>
      ) : (
        <>
          <div className="border border-green-500 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-2">
              Course Fit Leaderboard
            </h2>

            <p className="text-slate-400 mb-4">
              Player records analysed:
              <strong> {rounds.length}</strong>
            </p>

            <input
              type="text"
              placeholder="Search player..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-80 bg-slate-800 border border-slate-600 rounded px-3 py-2 mb-6"
            />

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-slate-700">
                  <tr>
                    <th className="py-2">Rank</th>
                    <th>Player</th>
                    <th>Course Fit</th>
                    <th>Driving</th>
                                        <th>Approach</th>
                    <th>Short Game</th>
                    <th>Putting</th>
                    <th>SG Total</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPlayers.map((player, index) => (
                    <tr
                      key={player.id}
                      className="border-b border-slate-800 hover:bg-slate-900"
                    >
                      <td className="py-3 font-bold">
                        {medal(index)}
                      </td>

                      <td>{player.name}</td>

                      <td className="font-bold text-green-400">
                        {player.overall}
                      </td>

                      <td>{player.driving}</td>

                      <td>{player.approach}</td>

                      <td>{player.shortGame}</td>

                      <td>{player.putting}</td>

                      <td>{player.sgTotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}