import { useEffect, useState } from "react";
import { getOfficialTournaments } from "../services/tournamentRegistry";
import { loadCourseForm } from "../services/courseFormService";

export default function CourseForm() {
  const [selectedTournament, setSelectedTournament] = useState("");
  const [tournaments, setTournaments] = useState([]);
  const [courseForm, setCourseForm] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const today = new Date();

        const completedTournaments = getOfficialTournaments()
          .filter(
            (tournament) =>
              new Date(tournament.end_date) < today
          )
          .sort(
            (a, b) =>
              new Date(b.start_date) -
              new Date(a.start_date)
          );

        setTournaments(completedTournaments);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function handleTournamentChange(id) {
    setSelectedTournament(id);

    if (!id) {
      setCourseForm([]);
      return;
    }

    const tournament = tournaments.find(
      (t) => String(t.id) === String(id)
    );

    if (!tournament) return;

    try {
      const data = await loadCourseForm(tournament);

      data.sort((a, b) => {
        if (a.averageFinish === null) return 1;
        if (b.averageFinish === null) return -1;
        return a.averageFinish - b.averageFinish;
      });

      setCourseForm(data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">
        Course Form
      </h1>

      <div className="rounded-xl bg-slate-900 p-6">
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Tournament
        </label>

        <select
          value={selectedTournament}
          onChange={(e) =>
            handleTournamentChange(e.target.value)
          }
          className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
        >
          <option value="">
            Select Tournament...
          </option>

          {tournaments.map((tournament) => (
            <option
              key={tournament.id}
              value={tournament.id}
            >
              {tournament.name} ({tournament.season})
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="text-slate-400">
          Loading tournaments...
        </div>
      )}

      {!loading && selectedTournament && (
        <div className="rounded-xl bg-slate-900 overflow-x-auto">
          <table className="min-w-full text-sm text-white">
            <thead className="bg-slate-800">
              <tr>
                <th className="p-3 text-left">Player</th>
                <th className="p-3">Starts</th>
                <th className="p-3">Cuts</th>
                <th className="p-3">Top 10s</th>
                <th className="p-3">Wins</th>
                <th className="p-3">Best</th>
                <th className="p-3">Average</th>
                <th className="p-3">Last</th>
              </tr>
            </thead>

            <tbody>
              {courseForm.map((player) => (
                <tr
                  key={player.player.id}
                  className="border-t border-slate-800"
                >
                  <td className="p-3">
                    {player.player.first_name}{" "}
                    {player.player.last_name}
                  </td>

                  <td className="text-center">
                    {player.starts}
                  </td>

                  <td className="text-center">
                    {player.cutsMade}
                  </td>

                  <td className="text-center">
                    {player.top10s}
                  </td>

                  <td className="text-center">
                    {player.wins}
                  </td>

                  <td className="text-center">
                    {player.bestFinish ?? "-"}
                  </td>

                  <td className="text-center">
                    {player.averageFinish ?? "-"}
                  </td>

                  <td className="text-center">
                    {player.lastSeason || "-"}
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