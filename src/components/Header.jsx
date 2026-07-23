import { Search, Bell, RefreshCw, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useGolfIQ } from "../context/GolfIQContext";

export default function Header() {
  const navigate = useNavigate();

  const { players = [], refreshData } = useGolfIQ();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  function handleSearch(value) {
    setSearch(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    const matches = players
      .filter((player) =>
        player.player.display_name
          .toLowerCase()
          .includes(value.toLowerCase())
      )
      .slice(0, 8);

    setResults(matches);
  }

  async function handleRefresh() {
    if (!refreshData) return;

    setRefreshing(true);

    try {
      await refreshData();
    } catch (err) {
      console.error(err);
    }

    setRefreshing(false);
  }

  function openPlayer(id) {
    setSearch("");
    setResults([]);
    navigate(`/player/${id}`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">

      <div className="mx-auto flex h-20 items-center justify-between px-6">

        <div
          onClick={() => navigate("/")}
          className="flex cursor-pointer items-center gap-3"
        >
          <div className="rounded-xl bg-green-500 p-3">

            <Trophy
              size={24}
              className="text-slate-900"
            />

          </div>

          <div>

            <h1 className="text-2xl font-bold text-green-400">
              GolfIQ Pro
            </h1>

            <p className="text-xs text-slate-400">
              Professional Golf Analytics
            </p>

          </div>

        </div>

        <div className="relative hidden w-full max-w-xl lg:block">

          <Search
            className="absolute left-4 top-4 text-slate-500"
            size={18}
          />

          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search any PGA Tour player..."
            className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-11 pr-4 text-white outline-none transition focus:border-green-400"
          />

          {results.length > 0 && (

            <div className="absolute mt-2 w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">

              {results.map((player) => (

                <button
                  key={player.player.id}
                  onClick={() =>
                    openPlayer(player.player.id)
                  }
                  className="flex w-full items-center justify-between border-b border-slate-800 px-4 py-3 text-left hover:bg-slate-800"
                >

                  <span>

                    {player.player.display_name}

                  </span>

                  <span className="text-slate-400">

                    {player.player.country}

                  </span>

                </button>

              ))}

            </div>

          )}

        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={handleRefresh}
            className="rounded-xl bg-slate-900 p-3 transition hover:bg-slate-800"
          >

            <RefreshCw
              size={20}
              className={
                refreshing
                  ? "animate-spin text-green-400"
                  : "text-green-400"
              }
            />

          </button>

          <button
            className="rounded-xl bg-slate-900 p-3 transition hover:bg-slate-800"
          >

            <Bell
              size={20}
              className="text-yellow-400"
            />

          </button>

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-500 text-lg font-bold text-slate-900">

            G

          </div>

        </div>

      </div>

    </header>
  );
}