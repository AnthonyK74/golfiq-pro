import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGolfIQ } from "../context/GolfIQContext";

export default function ComparePlayers() {
  const navigate = useNavigate();

  const { players, loading } = useGolfIQ();

  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");

  useEffect(() => {
    if (players.length >= 2) {
      setPlayer1(String(players[0].player.id));
      setPlayer2(String(players[1].player.id));
    }
  }, [players]);

  if (loading) {
    return (
      <div className="p-10 text-xl text-slate-400">
        Loading Players...
      </div>
    );
  }

  const p1 = players.find(
    (p) => String(p.player.id) === player1
  );

  const p2 = players.find(
    (p) => String(p.player.id) === player2
  );

  const statRow = (label, a, b, digits = 2) => (
    <tr className="border-b border-slate-800">
      <td className="py-3 font-semibold">{label}</td>
      <td className="text-center">
        {typeof a === "number" ? a.toFixed(digits) : a}
      </td>
      <td className="text-center">
        {typeof b === "number" ? b.toFixed(digits) : b}
      </td>
    </tr>
  );

  return (
    <div className="space-y-8">
      <button
        onClick={() => navigate("/")}
        className="rounded-xl bg-green-500 px-5 py-3 font-bold text-slate-900 hover:bg-green-400"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-5xl font-bold text-green-400">
        Compare Players
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        <select
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-900 p-4"
        >
          {players.map((player) => (
            <option
              key={player.player.id}
              value={player.player.id}
            >
              {player.player.display_name}
            </option>
          ))}
        </select>

        <select
          value={player2}
          onChange={(e) => setPlayer2(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-900 p-4"
        >
          {players.map((player) => (
            <option
              key={player.player.id}
              value={player.player.id}
            >
              {player.player.display_name}
            </option>
          ))}
        </select>
      </div>

      {p1 && p2 && (
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th></th>
              <th className="py-3">{p1.player.display_name}</th>
              <th>{p2.player.display_name}</th>
            </tr>
          </thead>

          <tbody>
            {statRow("GolfIQ CGI", p1.averages.cgi, p2.averages.cgi)}
            {statRow("SG Off The Tee", p1.averages.sg_off_tee, p2.averages.sg_off_tee, 3)}
            {statRow("SG Approach", p1.averages.sg_approach, p2.averages.sg_approach, 3)}
            {statRow("SG Around Green", p1.averages.sg_around_green, p2.averages.sg_around_green, 3)}
            {statRow("SG Putting", p1.averages.sg_putting, p2.averages.sg_putting, 3)}
            {statRow("SG Total", p1.averages.sg_total, p2.averages.sg_total, 3)}
            {statRow("Driving Distance", p1.averages.driving_distance, p2.averages.driving_distance, 1)}
            {statRow("Driving Accuracy", p1.averages.driving_accuracy, p2.averages.driving_accuracy, 1)}
            {statRow("Greens in Regulation", p1.averages.greens_in_regulation, p2.averages.greens_in_regulation, 1)}
            {statRow("Scrambling", p1.averages.scrambling, p2.averages.scrambling, 1)}
            {statRow("Birdies", p1.averages.birdies, p2.averages.birdies, 1)}
            {statRow("Eagles", p1.averages.eagles, p2.averages.eagles, 1)}
          </tbody>
        </table>
      )}
    </div>
  );
}