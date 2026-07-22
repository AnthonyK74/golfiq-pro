import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGolfIQ } from "../context/GolfIQContext";

const OPTIONS = [
  { label: "🏆 GolfIQ Rankings (CGI)", value: "cgi" },
  { label: "🏌️ SG Off The Tee", value: "sg_off_tee" },
  { label: "🎯 SG Approach", value: "sg_approach" },
  { label: "🌱 SG Around Green", value: "sg_around_green" },
  { label: "⛳ SG Putting", value: "sg_putting" },
  { label: "⭐ SG Total", value: "sg_total" },
];

export default function Statistics() {
  const navigate = useNavigate();

  const { players, loading } = useGolfIQ();

  const [stat, setStat] = useState("cgi");

  const leaderboard = useMemo(() => {
    const sorted = [...players];

    sorted.sort((a, b) => {
      if (stat === "cgi") {
        return b.averages.cgi - a.averages.cgi;
      }

      return (
        (b.averages?.[stat] ?? 0) -
        (a.averages?.[stat] ?? 0)
      );
    });

    return sorted;
  }, [players, stat]);

  if (loading) {
    return (
      <div className="p-10 text-xl text-slate-400">
        Loading Statistics...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <button
        onClick={() => navigate("/")}
        className="rounded-xl bg-green-500 px-5 py-3 font-bold text-slate-900 hover:bg-green-400"
      >
        ← Back to Dashboard
      </button>

      <div className="flex items-center justify-between">

        <h1 className="text-5xl font-bold text-green-400">
          GolfIQ Rankings
        </h1>

        <select
          value={stat}
          onChange={(e) => setStat(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-900 p-3 text-white"
        >
          {OPTIONS.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

      </div>

      <table className="w-full">

        <thead>

          <tr className="border-b border-slate-700 text-left">

            <th className="pb-3">Rank</th>
            <th>Player</th>
            <th>Country</th>
            <th>Value</th>

          </tr>

        </thead>

        <tbody>

          {leaderboard.map((player, index) => {

            const value =
              stat === "cgi"
                ? player.averages.cgi
                : player.averages[stat];

            return (

              <tr
                key={player.player.id}
                onClick={() =>
                  navigate(`/player/${player.player.id}`)
                }
                className="cursor-pointer border-b border-slate-800 hover:bg-slate-900"
              >

                <td className="py-4 font-bold">
                  {index + 1}
                </td>

                <td>{player.player.display_name}</td>

                <td>{player.player.country}</td>

                <td className="font-bold text-green-400">
                  {value.toFixed(3)}
                </td>

              </tr>

            );

          })}

        </tbody>

      </table>

    </div>
  );
}