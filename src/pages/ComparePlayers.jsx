import { useState } from "react";
import { useGolfIQ } from "../context/GolfIQContext";
import PlayerCard from "../components/PlayerCard";

export default function ComparePlayers() {
  const { players, loading } = useGolfIQ();

  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");

  if (loading) {
    return (
      <div className="py-20 text-center text-xl text-slate-400">
        Loading players...
      </div>
    );
  }

  const p1 = players.find(
    (p) => String(p.player.id) === player1
  );

  const p2 = players.find(
    (p) => String(p.player.id) === player2
  );

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-5xl font-bold text-green-400">
          Compare Players
        </h1>

        <p className="mt-2 text-slate-400">
          Compare GolfIQ analytics side by side
        </p>

      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        <select
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-white"
        >
          <option value="">Select Player 1</option>

          {players.map((p) => (
            <option
              key={p.player.id}
              value={p.player.id}
            >
              {p.player.display_name}
            </option>
          ))}
        </select>

        <select
          value={player2}
          onChange={(e) => setPlayer2(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-white"
        >
          <option value="">Select Player 2</option>

          {players.map((p) => (
            <option
              key={p.player.id}
              value={p.player.id}
            >
              {p.player.display_name}
            </option>
          ))}
        </select>

      </div>

      {p1 && p2 && (

        <>

          <div className="grid gap-6 xl:grid-cols-2">

            <PlayerCard player={p1} />

            <PlayerCard player={p2} />

          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">

            <table className="w-full">

              <thead>

                <tr className="border-b border-slate-700">

                  <th className="p-4 text-left">Statistic</th>

                  <th className="p-4">
                    {p1.player.display_name}
                  </th>

                  <th className="p-4">
                    {p2.player.display_name}
                  </th>

                </tr>

              </thead>

              <tbody>

                <CompareRow
                  title="CGI"
                  a={p1.averages.cgi}
                  b={p2.averages.cgi}
                />

                <CompareRow
                  title="SG Total"
                  a={p1.averages.sg_total}
                  b={p2.averages.sg_total}
                />

                <CompareRow
                  title="SG Off The Tee"
                  a={p1.averages.sg_off_tee}
                  b={p2.averages.sg_off_tee}
                />

                <CompareRow
                  title="SG Approach"
                  a={p1.averages.sg_approach}
                  b={p2.averages.sg_approach}
                />

                <CompareRow
                  title="SG Around Green"
                  a={p1.averages.sg_around_green}
                  b={p2.averages.sg_around_green}
                />

                <CompareRow
                  title="SG Putting"
                  a={p1.averages.sg_putting}
                  b={p2.averages.sg_putting}
                />

                <CompareRow
                  title="Driving Distance"
                  a={p1.averages.driving_distance}
                  b={p2.averages.driving_distance}
                  suffix=" yds"
                />

                <CompareRow
                  title="Driving Accuracy"
                  a={p1.averages.driving_accuracy}
                  b={p2.averages.driving_accuracy}
                  suffix="%"
                />

                <CompareRow
                  title="Greens In Regulation"
                  a={p1.averages.greens_in_regulation}
                  b={p2.averages.greens_in_regulation}
                  suffix="%"
                />

                <CompareRow
                  title="Scrambling"
                  a={p1.averages.scrambling}
                  b={p2.averages.scrambling}
                  suffix="%"
                />

              </tbody>

            </table>

          </div>

        </>

      )}

    </div>
  );
}

function CompareRow({
  title,
  a,
  b,
  suffix = ""
}) {
  const leftWins = a > b;

  return (
    <tr className="border-b border-slate-800">

      <td className="p-4 font-semibold">
        {title}
      </td>

      <td
        className={`p-4 text-center font-bold ${
          leftWins
            ? "text-green-400"
            : "text-white"
        }`}
      >
        {Number(a).toFixed(2)}
        {suffix}
      </td>

      <td
        className={`p-4 text-center font-bold ${
          !leftWins
            ? "text-green-400"
            : "text-white"
        }`}
      >
        {Number(b).toFixed(2)}
        {suffix}
      </td>

    </tr>
  );
}