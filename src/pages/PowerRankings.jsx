import { useMemo, useState } from "react";
import { useGolfIQ } from "../context/GolfIQContext";
import PlayerCard from "../components/PlayerCard";
import {
  getGolfIQRankings,
  getTopCGI,
  getTopSGTotal,
  getTopOffTheTee,
  getTopApproach,
  getTopAroundGreen,
  getTopPutting,
} from "../services/playerRankings";

export default function PowerRankings() {
  const { players, loading } = useGolfIQ();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("rating");

  const rankings = useMemo(() => {
    switch (sort) {
      case "cgi":
        return getTopCGI(players, players.length);

      case "sg":
        return getTopSGTotal(players, players.length);

      case "ott":
        return getTopOffTheTee(players, players.length);

      case "app":
        return getTopApproach(players, players.length);

      case "arg":
        return getTopAroundGreen(players, players.length);

      case "putt":
        return getTopPutting(players, players.length);

      default:
        return getGolfIQRankings(players);
    }
  }, [players, sort]);

  const filteredPlayers = rankings.filter((player) =>
    player.player.display_name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="py-20 text-center text-xl text-slate-400">
        Loading GolfIQ Power Rankings...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-5xl font-bold text-green-400">
          GolfIQ Power Rankings
        </h1>

        <p className="mt-2 text-slate-400">
          Live player rankings powered by the GolfIQ Rating Engine
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <div className="grid gap-4 lg:grid-cols-2">

          <input
            type="text"
            placeholder="Search player..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800 p-4 text-white outline-none focus:border-green-400"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-800 p-4 text-white outline-none focus:border-green-400"
          >
            <option value="rating">GolfIQ Rating</option>
            <option value="cgi">CGI</option>
            <option value="sg">SG Total</option>
            <option value="ott">SG Off The Tee</option>
            <option value="app">SG Approach</option>
            <option value="arg">SG Around Green</option>
            <option value="putt">SG Putting</option>
          </select>

        </div>

      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-700">

              <th className="p-4 text-left">Rank</th>
              <th className="p-4 text-left">Player</th>
              <th className="p-4 text-center">Country</th>
              <th className="p-4 text-center">Rating</th>
              <th className="p-4 text-center">CGI</th>
              <th className="p-4 text-center">SG Total</th>

            </tr>

          </thead>

          <tbody>

            {filteredPlayers.map((player, index) => {

              let medal = "";

              if (index === 0) medal = "🥇";
              if (index === 1) medal = "🥈";
              if (index === 2) medal = "🥉";

              return (
                <tr
                  key={player.player.id}
                  className="border-b border-slate-800 hover:bg-slate-800"
                >
                  <td className="p-4 font-bold text-green-400">
                    {medal} {index + 1}
                  </td>

                  <td className="p-4 font-semibold">
                    {player.player.display_name}
                  </td>

                  <td className="p-4 text-center">
                    {player.player.country}
                  </td>

                  <td className="p-4 text-center font-bold text-green-400">
                    {player.rating ??
                      player.averages.cgi.toFixed(1)}
                  </td>

                  <td className="p-4 text-center">
                    {player.averages.cgi.toFixed(2)}
                  </td>

                  <td className="p-4 text-center">
                    {player.averages.sg_total.toFixed(2)}
                  </td>

                </tr>
              );

            })}

          </tbody>

        </table>

      </div>

      <div>

        <h2 className="mb-5 text-3xl font-bold text-green-400">
          Top 6 Players
        </h2>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {filteredPlayers.slice(0, 6).map((player) => (
            <PlayerCard
              key={player.player.id}
              player={player}
            />
          ))}

        </div>

      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 text-center text-slate-400">
        Showing{" "}
        <strong>{filteredPlayers.length}</strong>{" "}
        golfers
      </div>

    </div>
  );
}