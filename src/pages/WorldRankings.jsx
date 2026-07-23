import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGolfIQ } from "../context/GolfIQContext";

export default function WorldRankings() {
  const navigate = useNavigate();
  const { players, loading } = useGolfIQ();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("golfIQ");

  const rankings = useMemo(() => {
    let filtered = [...players];

    if (search.trim()) {
      const term = search.toLowerCase();

      filtered = filtered.filter((p) =>
        `${p.player.first_name} ${p.player.last_name}`
          .toLowerCase()
          .includes(term)
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "cgi":
          return b.averages.cgi - a.averages.cgi;

        case "ott":
          return b.averages.sg_off_tee - a.averages.sg_off_tee;

        case "app":
          return b.averages.sg_approach - a.averages.sg_approach;

        case "arg":
          return b.averages.sg_around_green - a.averages.sg_around_green;

        case "putt":
          return b.averages.sg_putting - a.averages.sg_putting;

        case "total":
          return b.averages.sg_total - a.averages.sg_total;

        default:
          return b.golfIQ.rating - a.golfIQ.rating;
      }
    });

    return filtered;
  }, [players, search, sortBy]);

  return (
    <div className="mx-auto max-w-7xl">

      <button
        onClick={() => navigate("/")}
        className="mb-8 rounded-xl bg-green-500 px-5 py-3 font-bold text-slate-900 hover:bg-green-400"
      >
        ← Dashboard
      </button>

      <h1 className="text-4xl font-bold text-green-400">
        🏆 GolfIQ World Rankings
      </h1>

      <p className="mt-2 mb-8 text-slate-400">
        Live rankings generated from GolfIQ analytics.
      </p>

      {loading ? (
        <div className="rounded-xl bg-slate-900 p-10 text-center">
          Loading rankings...
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-col gap-4 md:flex-row">

            <input
              type="text"
              placeholder="Search player..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-green-400"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3"
            >
              <option value="golfIQ">GolfIQ Rating</option>
              <option value="cgi">CGI</option>
              <option value="ott">SG Off The Tee</option>
              <option value="app">SG Approach</option>
              <option value="arg">SG Around Green</option>
              <option value="putt">SG Putting</option>
              <option value="total">SG Total</option>
            </select>

          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-800">

            <table className="min-w-full">

              <thead className="bg-slate-900">

                <tr>

                  <th className="px-4 py-4 text-left">Rank</th>
                  <th className="px-4 py-4 text-left">Player</th>
                  <th className="px-4 py-4 text-left">Country</th>
                  <th className="px-4 py-4 text-right">GolfIQ</th>
                  <th className="px-4 py-4 text-right">CGI</th>
                  <th className="px-4 py-4 text-right">SG Total</th>
                  <th className="px-4 py-4 text-center">Trend</th>

                </tr>

              </thead>

              <tbody>

                {rankings.map((player, index) => (

                  <tr
                    key={player.player.id}
                    onClick={() => navigate(`/player/${player.player.id}`)}
                    className="cursor-pointer border-t border-slate-800 hover:bg-slate-900"
                  >

                    <td className="px-4 py-4 font-bold text-green-400">
                      {index + 1}
                    </td>

                    <td className="px-4 py-4 font-semibold">
                      {player.player.first_name} {player.player.last_name}
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

          <p className="mt-6 text-sm text-slate-500">
            Showing {rankings.length} players.
          </p>

        </>
      )}

    </div>
  );
}