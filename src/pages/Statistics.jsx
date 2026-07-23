import { useMemo, useState } from "react";
import { useGolfIQ } from "../context/GolfIQContext";
import PlayerCard from "../components/PlayerCard";

export default function Statistics() {
  const { players, loading } = useGolfIQ();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("golfiq");

  const filteredPlayers = useMemo(() => {
    const data = [...players];

    const term = search.trim().toLowerCase();

    const filtered = data.filter((player) =>
      player.player.display_name
        .toLowerCase()
        .includes(term)
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "golfiq":
          return (
            (b.golfIQ?.rating ?? 0) -
            (a.golfIQ?.rating ?? 0)
          );

        case "cgi":
          return (
            b.averages.cgi -
            a.averages.cgi
          );

        case "total":
          return (
            b.averages.sg_total -
            a.averages.sg_total
          );

        case "ott":
          return (
            b.averages.sg_off_tee -
            a.averages.sg_off_tee
          );

        case "app":
          return (
            b.averages.sg_approach -
            a.averages.sg_approach
          );

        case "arg":
          return (
            b.averages.sg_around_green -
            a.averages.sg_around_green
          );

        case "putt":
          return (
            b.averages.sg_putting -
            a.averages.sg_putting
          );

        case "distance":
          return (
            b.averages.driving_distance -
            a.averages.driving_distance
          );

        case "accuracy":
          return (
            b.averages.driving_accuracy -
            a.averages.driving_accuracy
          );

        default:
          return (
            (b.golfIQ?.rating ?? 0) -
            (a.golfIQ?.rating ?? 0)
          );
      }
    });

    return filtered;
  }, [players, search, sortBy]);

  if (loading) {
    return (
      <div className="py-20 text-center text-xl text-slate-400">
        Loading GolfIQ Statistics...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">

        <div>

          <h1 className="text-5xl font-bold text-green-400">
            GolfIQ Rankings
          </h1>

          <p className="mt-2 text-slate-400">
            Live player analytics from the last five starts
          </p>

        </div>

        <div className="rounded-xl bg-slate-900 px-6 py-4 text-center">

          <div className="text-sm text-slate-400">
            Players Analysed
          </div>

          <div className="text-3xl font-bold text-green-400">
            {players.length}
          </div>

        </div>

      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <div className="grid gap-4 lg:grid-cols-2">

          <input
            type="text"
            placeholder="Search player..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="rounded-xl border border-slate-700 bg-slate-800 p-4 text-white outline-none focus:border-green-400"
          />

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
            className="rounded-xl border border-slate-700 bg-slate-800 p-4 text-white outline-none focus:border-green-400"
          >
            <option value="golfiq">
              GolfIQ Rating
            </option>

            <option value="cgi">
              Combined Golf Index
            </option>

            <option value="total">
              SG Total
            </option>

            <option value="ott">
              SG Off The Tee
            </option>

            <option value="app">
              SG Approach
            </option>

            <option value="arg">
              SG Around Green
            </option>

            <option value="putt">
              SG Putting
            </option>

            <option value="distance">
              Driving Distance
            </option>

            <option value="accuracy">
              Driving Accuracy
            </option>

          </select>

        </div>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {filteredPlayers.map((player) => (
          <PlayerCard
            key={player.player.id}
            player={player}
          />
        ))}

      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center">

        <div className="text-lg">

          Showing{" "}

          <span className="font-bold text-green-400">
            {filteredPlayers.length}
          </span>{" "}

          golfers

        </div>

      </div>

    </div>
  );
}