import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardCard from "./components/DashboardCard";

import WorldRankings from "./pages/WorldRankings";
import PlayerSearch from "./pages/PlayerSearch";
import Schedule from "./pages/Schedule";
import GoatRankings from "./pages/GoatRankings";

import {
  Trophy,
  Search,
  Calendar,
  BarChart3,
  Target,
  Star,
} from "lucide-react";

export default function App() {
  const [page, setPage] = useState("dashboard");

  const cards = [
    {
      title: "World Rankings",
      icon: Trophy,
      desc: "Official OWGR rankings",
    },
    {
      title: "Player Search",
      icon: Search,
      desc: "Search every golfer",
    },
    {
      title: "Live Tournaments",
      icon: Calendar,
      desc: "Tournament schedule",
    },
    {
      title: "Statistics",
      icon: BarChart3,
      desc: "Advanced statistics",
    },
    {
      title: "Predictions",
      icon: Target,
      desc: "AI tournament predictions",
    },
    {
      title: "GOAT Rankings",
      icon: Star,
      desc: "Greatest golfers ever",
    },
  ];

  const news = [
    "Scottie Scheffler remains World No.1",
    "The Open Championship begins Thursday",
    "Rory McIlroy looking for another major",
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <main className="p-8">

          {page === "dashboard" && (
            <>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {cards.map((card) => (
                  <DashboardCard
                    key={card.title}
                    card={card}
                    setPage={setPage}
                  />
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="mb-4 text-2xl font-bold text-green-400">
                  Latest Golf News
                </h2>

                <ul className="space-y-3">
                  {news.map((item) => (
                    <li
                      key={item}
                      className="border-b border-slate-800 pb-3 text-slate-300"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {page === "world-rankings" && (
            <WorldRankings setPage={setPage} />
          )}

          {page === "player-search" && (
            <PlayerSearch setPage={setPage} />
          )}

          {page === "schedule" && (
            <Schedule setPage={setPage} />
          )}

          {page === "goat-rankings" && (
            <GoatRankings setPage={setPage} />
          )}

          {page === "statistics" && (
            <div className="p-10">
              <button
                onClick={() => setPage("dashboard")}
                className="mb-8 rounded-xl bg-green-500 px-5 py-3 font-bold text-slate-900 hover:bg-green-400"
              >
                ← Back to Dashboard
              </button>

              <h1 className="text-4xl font-bold text-green-400">
                📊 Statistics
              </h1>

              <p className="mt-6 text-slate-400">
                Coming soon...
              </p>
            </div>
          )}

          {page === "predictions" && (
            <div className="p-10">
              <button
                onClick={() => setPage("dashboard")}
                className="mb-8 rounded-xl bg-green-500 px-5 py-3 font-bold text-slate-900 hover:bg-green-400"
              >
                ← Back to Dashboard
              </button>

              <h1 className="text-4xl font-bold text-green-400">
                🎯 GolfIQ Predictions
              </h1>

              <p className="mt-6 text-slate-400">
                Coming soon...
              </p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}