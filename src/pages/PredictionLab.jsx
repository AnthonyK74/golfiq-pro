import { useMemo } from "react";
import { useGolfIQ } from "../context/GolfIQContext";
import { calculatePrediction } from "../utils/predictionEngine";

export default function PredictionLab() {
  const { players, loading } = useGolfIQ();

  const predictions = useMemo(() => {
    return [...players]
      .map((player) => ({
        ...player,
        prediction: calculatePrediction(player),
      }))
      .sort(
        (a, b) =>
          b.prediction.score - a.prediction.score
      );
  }, [players]);

  if (loading) {
    return (
      <div className="p-10 text-xl text-slate-400">
        Loading Prediction Lab...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <h1 className="text-5xl font-bold text-green-400">
        🧪 GolfIQ Prediction Lab
      </h1>

      <table className="w-full">

        <thead>

          <tr className="border-b border-slate-700">

            <th className="text-left py-3">Rank</th>
            <th className="text-left">Player</th>
            <th>CGI</th>
            <th>Prediction</th>
            <th>Form</th>
            <th>Confidence</th>

          </tr>

        </thead>

        <tbody>

          {predictions.slice(0, 20).map((player, index) => (

            <tr
              key={player.player.id}
              className="border-b border-slate-800"
            >

              <td className="py-4">{index + 1}</td>

              <td>{player.player.display_name}</td>

              <td>{player.averages.cgi.toFixed(2)}</td>

              <td>
                {player.prediction.score.toFixed(0)}
              </td>

              <td>
                {player.prediction.emoji}
                {" "}
                {player.prediction.form}
              </td>

              <td>
                {player.prediction.confidence}%
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}