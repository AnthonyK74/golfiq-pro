import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUpcomingTournaments } from "../services/golfApi";

export default function Schedule() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);

        const response = await getUpcomingTournaments();

        console.log("Upcoming Tournament Response:", response);

        let tournaments = [];

        if (Array.isArray(response)) {
          tournaments = response;
        } else if (Array.isArray(response.data)) {
          tournaments = response.data;
        } else if (Array.isArray(response.results)) {
          tournaments = response.results;
        }

        setEvents(tournaments);
      } catch (err) {
        console.error(err);
        setError("Unable to load tournament schedule.");
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
        ← Dashboard
      </button>

      <h1 className="text-4xl font-bold text-green-400">
        📅 Tournament Schedule
      </h1>

      <p className="mb-8 mt-2 text-slate-400">
        Browse current and upcoming PGA Tour events.
      </p>

      {loading && (
        <div className="rounded-xl bg-slate-900 p-10 text-center text-white">
          Loading tournaments...
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-600 bg-red-950/30 p-6 text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && events.length === 0 && (
        <div className="rounded-xl border border-yellow-600 bg-yellow-950/20 p-6 text-yellow-300">
          No scheduled tournaments were returned by the API.
          <br />
          Check the browser console for the full API response.
        </div>
      )}

      {!loading && !error && events.length > 0 && (
        <div className="space-y-6">
          {events.map((event) => (
            <div
              key={event.id}
              onClick={() => navigate(`/tournament/${event.id}`)}
              className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-green-500 hover:bg-slate-800"
            >
              <div className="flex flex-col justify-between gap-4 lg:flex-row">
                <div>
                  <div className="mb-2 inline-block rounded-full bg-green-500 px-3 py-1 text-sm font-bold text-slate-900">
                    {event.status ?? "Tournament"}
                  </div>

                  <h2 className="text-3xl font-bold text-white">
                    {event.name}
                  </h2>

                  <p className="mt-3 text-slate-300">
                    🏌️ {event.course_name ?? event.course ?? "Course TBA"}
                  </p>

                  <p className="text-slate-300">
                    📍 {[event.city, event.state, event.country]
                      .filter(Boolean)
                      .join(", ") || "Location TBA"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-5 lg:min-w-[320px]">
                  <InfoCard
                    title="Start Date"
                    value={event.start_date ?? "TBA"}
                  />

                  <InfoCard
                    title="End Date"
                    value={event.end_date ?? "TBA"}
                  />

                  <InfoCard
                    title="Purse"
                    value={event.purse ?? "TBA"}
                  />

                  <InfoCard
                    title="Tournament Hub"
                    value="Open →"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="rounded-xl bg-slate-950 p-4">
      <div className="text-sm text-slate-400">{title}</div>
      <div className="mt-2 font-bold text-green-400">{value}</div>
    </div>
  );
}