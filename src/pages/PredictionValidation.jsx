import { useEffect, useState } from "react";
import { getCompletedTournaments } from "../services/golfApi";

export default function PredictionValidation() {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] =
    useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await getCompletedTournaments();
        setTournaments(response.data ?? []);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-white">
        Loading tournaments...
      </div>
    );
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-2">
        Prediction Validation
      </h1>

      <p className="mb-6 text-slate-400">
        Test GolfIQ against historical tournaments.
      </p>

      <div className="space-y-2">
        {tournaments.map((tournament) => (
          <div key={tournament.id}>
            <button
              onClick={() =>
                setSelectedTournament(
                  selectedTournament?.id === tournament.id
                    ? null
                    : tournament
                )
              }
              className={`w-full rounded-lg p-4 text-left transition ${
                selectedTournament?.id === tournament.id
                  ? "bg-green-700"
                  : "bg-slate-800 hover:bg-slate-700"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">
                    {tournament.name}
                  </div>

                  <div className="text-sm text-slate-300">
                    Season {tournament.season}
                  </div>
                </div>

                <div className="text-sm">
                  {selectedTournament?.id === tournament.id
                    ? "▲"
                    : "▼"}
                </div>
              </div>
            </button>

            {selectedTournament?.id === tournament.id && (
              <div className="mt-2 mb-4 rounded-lg border border-slate-700 bg-slate-900 p-6">
                <h2 className="text-2xl font-bold">
                  {tournament.name}
                </h2>

                <p className="mt-2 text-slate-400">
                  Season {tournament.season}
                </p>

                <div className="mt-6 rounded-lg bg-slate-800 p-4">
                  <p className="text-green-400 font-semibold">
                    Ready for validation
                  </p>

                  <p className="mt-2 text-slate-300">
                    The next step will generate GolfIQ
                    predictions using only tournaments
                    played before this event and compare
                    them with the real finishing positions.
                  </p>

                  <button
                    className="mt-6 rounded bg-green-600 px-5 py-2 font-semibold hover:bg-green-500"
                  >
                    Validate Tournament
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}