import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTournamentDetails } from "../services/tournamentService";

export default function TournamentHub() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTournament() {
      try {
        setLoading(true);

        const tournament = await getTournamentDetails(id);

setTournament(tournament);
      } catch (err) {
        console.error(err);
        setError("Unable to load tournament.");
      } finally {
        setLoading(false);
      }
    }

    loadTournament();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl py-20 text-center text-slate-400">
        Loading tournament...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl py-20">
        <div className="rounded-xl border border-red-500 bg-red-900/20 p-6">
          {error}
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="mx-auto max-w-7xl py-20 text-center text-slate-400">
        Tournament not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">

      <button
        onClick={() => navigate(-1)}
        className="mb-8 rounded-xl bg-green-500 px-5 py-3 font-bold text-slate-900 hover:bg-green-400"
      >
        ← Back
      </button>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

        <div className="mb-4 inline-block rounded-full bg-green-500 px-3 py-1 text-sm font-bold text-slate-900">
          {tournament.status}
        </div>

        <h1 className="text-4xl font-bold text-green-400">
          {tournament.name}
        </h1>

        <div className="mt-6 grid gap-4 md:grid-cols-2">

          <InfoCard
            title="Course"
            value={tournament.course_name || "TBA"}
          />

          <InfoCard
            title="Location"
            value={[
              tournament.city,
              tournament.state,
              tournament.country,
            ]
              .filter(Boolean)
              .join(", ")}
          />

          <InfoCard
            title="Start Date"
            value={tournament.start_date}
          />

          <InfoCard
            title="End Date"
            value={tournament.end_date}
          />

          <InfoCard
            title="Purse"
            value={tournament.purse || "TBA"}
          />

          <InfoCard
            title="Season"
            value={tournament.season}
          />

        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
<button
  onClick={() => navigate(`/tournament/${id}/leaderboard`)}
  className="rounded-xl bg-green-500 py-4 font-bold text-slate-900 hover:bg-green-400"
>
  📊 Tournament Statistics
</button>
          

          <button onClick={() => navigate(`/tournament/${id}/golfiq`)}
  className="rounded-xl bg-slate-800 py-4 hover:bg-slate-700"
>
  ⭐ GolfIQ Rankings
          </button>

          <button className="rounded-xl bg-slate-800 py-4 hover:bg-slate-700">
            🎯 Course Fit
          </button>

          <button className="rounded-xl bg-slate-800 py-4 hover:bg-slate-700">
            🏆 Tournament Predictor
          </button>

        </div>

      </div>

    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="rounded-xl bg-slate-950 p-5">
      <div className="text-sm text-slate-400">{title}</div>
      <div className="mt-2 text-lg font-bold text-white">
        {value || "N/A"}
      </div>
    </div>
  );
}