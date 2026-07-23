import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGolfIQ } from "../context/GolfIQContext";

export default function PlayerSearch() {
  const navigate = useNavigate();
  const { players, loading } = useGolfIQ();

  const [search, setSearch] = useState("");

  const filteredPlayers = useMemo(() => {
    if (!search.trim()) return players;

    const term = search.toLowerCase();

    return players.filter((player) => {
      const name =
        `${player.player.first_name} ${player.player.last_name}`.toLowerCase();

      return name.includes(term);
    });
  }, [players, search]);

  return (
    <div className="mx-auto max-w-7xl">

      <button
        onClick={() => navigate("/")}
        className="mb-8 rounded-xl bg-green-500 px-5 py-3 font-bold text-slate-900 hover:bg-green-400"
      >
        ← Dashboard
      </button>

      <h1 className="text-4xl font-bold text-green-400">
        🔍 Player Search
      </h1>

      <p className="mt-2 mb-8 text-slate-400">
        Search every player in the GolfIQ database.
      </p>

      <input
        type="text"
        placeholder="Search player..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-8 w-full rounded-xl border border-slate-700 bg-slate-900 px-5 py-4 text-white outline-none focus:border-green-400"
      />

      {loading ? (
        <div className="rounded-xl bg-slate-900 p-10 text-center">
          Loading players...
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-800">

          <table className="min-w-full">

            <thead className="bg-slate-900">

              <tr>

                <th className="px-4 py-4 text-left">
                  Player
                </th>

                <th className="px-4 py-4 text-left">
                  Country
                </th>

                <th className="px-4 py-4 text-right">
                  GolfIQ
                </th>

                <th className="px-4 py-4 text-right">
                  CGI
                </th>

                <th className="px-4 py-4 text-right">
                  SG Total
                </th>

                <th className="px-4 py-4 text-center">
                  Trend
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredPlayers.map((player) => (

                <tr
                  key={player.player.id}
                  onClick={() => navigate(`/player/${player.player.id}`)}
                  className="cursor-pointer border-t border-slate-800 hover:bg-slate-900"
                >

                  <td className="px-4 py-4 font-semibold">
                    {player.player.first_name}{" "}
                    {player.player.last_name}
                  </td>

                  <td className="px-4 py-4">
                    {player.player.country}
                  </td>

                  <td className="px-4 py-4 text-right font-bold text-green-400">
                    {player.golfIQ.rating.toFixed(1)}
                  </td>

                  <td className="px-4 py-4 text-right">
                    {player.averages.cgi.toFixed(2)}
                  </td>

                  <td className="px-4 py-4 text-right">
                    {player.averages.sg_total.toFixed(2)}
                  </td>

                  <td className="px-4 py-4 text-center text-xl">
                    {player.trend}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}

      {!loading && (
        <p className="mt-6 text-sm text-slate-500">
          {filteredPlayers.length} player
          {filteredPlayers.length !== 1 ? "s" : ""} found.
        </p>
      )}

    </div>
  );
}