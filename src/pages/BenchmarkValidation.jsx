import { useState } from "react";
import {
  getOfficialTournaments,
} from "../services/tournamentRegistry";
import { validateTournament } from "../services/validationService";

export default function BenchmarkValidation() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState([]);

  async function runBenchmark() {
    try {
      setRunning(true);

      const tournaments =
        getOfficialTournaments().slice(0, 10);

      const output = [];

      for (const tournament of tournaments) {
        console.log(
          `Validating ${tournament.name}...`
        );

        const result =
          await validateTournament(
            tournament.id
          );
console.log(result);

        output.push(result);
      }

      setResults(output);

    } catch (err) {
      console.error(err);
    } finally {
      setRunning(false);
    }
  }

  const averageTop5 =
    results.length
      ? (
          results.reduce(
            (sum, r) =>
              sum + r.top5Percentage,
            0
          ) / results.length
        ).toFixed(1)
      : 0;

  const averageTop10 =
    results.length
      ? (
          results.reduce(
            (sum, r) =>
              sum + r.top10Percentage,
            0
          ) / results.length
        ).toFixed(1)
      : 0;

  const averageTop20 =
    results.length
      ? (
          results.reduce(
            (sum, r) =>
              sum + r.top20Percentage,
            0
          ) / results.length
        ).toFixed(1)
      : 0;

  const averageError =
    results.length
      ? (
          results.reduce(
            (sum, r) =>
              sum + r.meanRankingError,
            0
          ) / results.length
        ).toFixed(2)
      : 0;

  return (
    <div className="p-8 text-white">

      <h1 className="text-3xl font-bold mb-6">
        Benchmark Validation
      </h1>

      <button
        onClick={runBenchmark}
        disabled={running}
        className="rounded bg-green-600 px-5 py-2 font-semibold"
      >
        {running
          ? "Running..."
          : "Run Last 10 Tournaments"}
      </button>

      {results.length > 0 && (
        <>
          <table className="mt-8 w-full">

            <thead>

              <tr>
                <th>Tournament</th>
                <th>Winner</th>
                <th>Top5</th>
                <th>Top10</th>
                <th>Top20</th>
                <th>Mean Error</th>
              </tr>

            </thead>

            <tbody>

              {results.map((result) => (
                <tr key={result.tournamentId}>
                  <td>{result.tournamentName}</td>
                  <td>
                    {result.winnerCorrect
                      ? "✅"
                      : "❌"}
                  </td>
                  <td>{result.top5Percentage}%</td>
                  <td>{result.top10Percentage}%</td>
                  <td>{result.top20Percentage}%</td>
                  <td>
                    {result.meanRankingError}
                  </td>
                </tr>
              ))}

            </tbody>

          </table>

          <div className="mt-8 rounded bg-slate-800 p-6">

            <h2 className="text-xl font-bold mb-4">
              Benchmark Averages
            </h2>

            <p>Top 5: {averageTop5}%</p>

            <p>Top 10: {averageTop10}%</p>

            <p>Top 20: {averageTop20}%</p>

            <p>
              Mean Ranking Error:
              {" "}
              {averageError}
            </p>

          </div>

        </>
      )}

    </div>
  );
}