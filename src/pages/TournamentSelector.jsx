import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUpcomingTournaments } from "../services/golfApi";

export default function TournamentSelector() {
  const navigate = useNavigate();

  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTournaments() {
      try {
        setLoading(true);

        const response = await getUpcomingTournaments();

        setTournaments(response.data ?? []);
      } catch (err) {
        console.error(err);
        setError("Unable to load upcoming tournaments.");
      } finally {
        setLoading(false);
      }
    }

    loadTournaments();
  }, []);

  return (
    <div className="mx-auto max-w-6xl">

      <button
        onClick={() => navigate("/")}
        className="mb-8 rounded-xl bg-green-500 px-5 py-3 font-bold text-slate-900 hover:bg-green-400"
      >
        ← Back to Dashboard
      </button>

      <h1 className="mb-2 text-4xl font-bold text-green-400">
        🏆 Tournament Selector
      </h1>

      <p className="mb-8 text-slate-400">
        Select a PGA Tour event to generate GolfIQ predictions.
      </p>

      {loading && (
        <div className="py-20 text-center text-slate-400">
          Loading tournaments...
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500 bg-red-900/20 p-6">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-6">

          {tournaments.map((tournament) => (

            <button
              key={tournament.id}
              onClick={() =>
                navigate(`/predictor/${tournament.id}`)
              }
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left transition hover:border-green-500 hover:bg-slate-800"
            >

              <h2 className="text-2xl font-bold text-green-400">
                {tournament.name}
              </h2>

              <p className="mt-2 text-slate-400">
                {tournament.course}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                {tournament.start_date}
              </p>

            </button>

          ))}

        </div>
      )}
    </div>
  );
}