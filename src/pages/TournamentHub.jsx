import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUpcomingTournaments } from "../services/golfApi";

export default function TournamentHub() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);

        const response = await getUpcomingTournaments();

        setEvents(response.data ?? []);
      } catch (err) {
        console.error(err);
        setError("Unable to load tournaments.");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  return (
    <div className="mx-auto max-w-7xl">

      <button
        onClick={() => navigate("/")}
        className="mb-8 rounded-xl bg-green-500 px-5 py-3 font-bold text-slate-900 hover:bg-green-400"
      >
        ← Back to Dashboard
      </button>

      <h1 className="mb-2 text-4xl font-bold text-green-400">
        🏆 Tournament Hub
      </h1>

      <p className="mb-8 text-slate-400">
        Select a PGA Tour event to view predictions, course fit, field analysis
        and live information.
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
        <div className="grid gap-6 md:grid-cols-2">

          {events.map((event) => (

            <div
              key={event.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-green-500"
            >
              <h2 className="text-2xl font-bold text-green-400">
                {event.name}
              </h2>

              <p className="mt-3 text-slate-300">
                📅 {event.start_date}
              </p>

              <p className="mt-2 text-slate-400">
                {event.course ?? "Course information coming soon"}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">

                <button
                  className="rounded-lg bg-green-500 px-4 py-2 font-semibold text-slate-900 hover:bg-green-400"
                >
                  Tournament Predictor
                </button>

                <button
                  className="rounded-lg bg-slate-800 px-4 py-2 hover:bg-slate-700"
                >
                  Course Fit
                </button>

                <button
                  className="rounded-lg bg-slate-800 px-4 py-2 hover:bg-slate-700"
                >
                  Field Analysis
                </button>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}