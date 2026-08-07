import { useEffect, useState } from "react";
import { getOfficialTournaments } from "../services/tournamentRegistry";

export default function CourseForm() {
  const [selectedTournament, setSelectedTournament] = useState("");
  const [tournaments, setTournaments] = useState([]);
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-green-400">
        Course Form
      </h1>

      <div className="rounded-xl bg-slate-900 p-6">
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Tournament
        </label>

        <select
          value={selectedTournament}
          onChange={(e) =>
            setSelectedTournament(e.target.value)
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

      {!selectedTournament && (
        <div className="rounded-xl bg-slate-900 p-8 text-center text-slate-400">
          Select a tournament to view historical course form.
        </div>
      )}

      {loading && (
        <div className="text-slate-400">
          Loading tournaments...
        </div>
      )}
    </div>
  );
}