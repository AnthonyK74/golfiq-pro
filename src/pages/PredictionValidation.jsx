import { useEffect, useState } from "react";
import { getCompletedTournaments } from "../services/golfApi";
import { validateTournament } from "../services/validationService";

export default function PredictionValidation() {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [validating, setValidating] =
    useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const response =
          await getCompletedTournaments();

        setTournaments(
  (response.data ?? []).sort(
    (a, b) =>
      new Date(b.start_date) -
      new Date(a.start_date)
  )
);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function runValidation() {
    if (!selectedTournament) return;

    try {
      setValidating(true);

      console.clear();

      console.log(
        "================================="
      );
      console.log(
        "RUNNING HISTORICAL VALIDATION"
      );
      console.log(selectedTournament.name);

      const output =
        await validateTournament(
          selectedTournament.id
        );

      console.log(output);

      setResults(output);
    } catch (err) {
      console.error(err);
    } finally {
      setValidating(false);
    }
  }

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
        Test GolfIQ against historical
        tournaments.
      </p>

      <div className="space-y-2">
        {tournaments.map((tournament) => (
          <div key={tournament.id}>
            <button
              onClick={() =>
                setSelectedTournament(
                  selectedTournament?.id ===
                    tournament.id
                    ? null
                    : tournament
                )
              }
              className={`w-full rounded-lg p-4 text-left transition ${
                selectedTournament?.id ===
                tournament.id
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
  {new Date(tournament.start_date).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  )}{" "}
  • Season {tournament.season}
</div>
                </div>

                <div>
                  {selectedTournament?.id ===
                  tournament.id
                    ? "▲"
                    : "▼"}
                </div>
              </div>
            </button>

            {selectedTournament?.id ===
              tournament.id && (
              <div className="mt-2 mb-4 rounded-lg border border-slate-700 bg-slate-900 p-6">
                <h2 className="text-2xl font-bold">
                  {tournament.name}
                </h2>

                <p className="mt-2 text-slate-400">
                  Season {tournament.season}
                </p>

                <div className="mt-6 rounded-lg bg-slate-800 p-4">
                  <p className="font-semibold text-green-400">
                    Ready for validation
                  </p>

                  <p className="mt-2 text-slate-300">
                    Build GolfIQ predictions
                    using only data available
                    before this tournament and
                    compare them against the
                    actual finishing positions.
                  </p>

                  <button
                    onClick={runValidation}
                    disabled={validating}
                    className="mt-6 rounded bg-green-600 px-5 py-2 font-semibold hover:bg-green-500 disabled:opacity-50"
                  >
                    {validating
                      ? "Validating..."
                      : "Validate Tournament"}
                  </button>
                </div>

                {results && (
                  <div className="mt-6 rounded-lg bg-slate-800 p-6">
                    <h3 className="mb-4 text-xl font-bold">
                      Validation Results
                    </h3>

                    <div className="space-y-2 text-sm">
                      <div>
                        Players Analysed:{" "}
                        {
                          results.playersAnalysed
                        }
                      </div>

                      <div>
                        Players Compared:{" "}
                        {
                          results.playersCompared
                        }
                      </div>

                      <div>
                        Predicted Winner:{" "}
                        {
                          results.predictedWinner
                        }
                      </div>

                      <div>
                        Actual Winner:{" "}
                        {results.actualWinner}
                      </div>

                      <div>
                        Winner Correct:{" "}
                        {results.winnerCorrect
                          ? "✅ Yes"
                          : "❌ No"}
                      </div>

                      <div>
                        Top 5:{" "}
                        {
                          results.top5Correct
                        }
                        /5 (
                        {
                          results.top5Percentage
                        }
                        %)
                      </div>

                      <div>
                        Top 10:{" "}
                        {
                          results.top10Correct
                        }
                        /10 (
                        {
                          results.top10Percentage
                        }
                        %)
                      </div>

                      <div>
                        Top 20:{" "}
                        {
                          results.top20Correct
                        }
                        /20 (
                        {
                          results.top20Percentage
                        }
                        %)
                      </div>

                      <div>
                        Mean Ranking Error:{" "}
                        {
                          results.meanRankingError
                        }
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}