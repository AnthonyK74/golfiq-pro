import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardCard from "./components/DashboardCard";
import WorldRankings from "./pages/WorldRankings";
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
    {title: "World Rankings",
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
    desc: "Scores and leaderboards",
  },
  {
    title: "Statistics",
    icon: BarChart3,
    desc: "Advanced analytics",
  },
  {
    title: "Predictions",
    icon: Target,
    desc: "GolfIQ AI predictions",
  },
  {
    title: "GOAT Rankings",
    icon: Star,
    desc: "Greatest players ever",
  },
];

  const news = [
    "Scottie Scheffler remains World No.1",
    "The Open Championship begins Thursday",
    "Rory McIlroy looking for another major",
  ];
if (page === "world-rankings") {
  return <WorldRankings />;
}
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">
        <Header />

        <main className="p-8">

  {/* Dashboard Cards */}
<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
  {cards.map((card) => (
    <DashboardCard
  key={card.title}
  card={card}
  setPage={setPage}
/>
  ))}
</div>

  {/* Bottom Section */}
          <div className="mt-8 grid gap-6 lg:grid-cols-3">

            {/* Featured Tournament */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm uppercase tracking-widest text-green-400">
                Featured Tournament
              </p>

              <h3 className="mt-3 text-2xl font-bold">
                The Open Championship
              </h3>

              <p className="mt-2 text-slate-400">
                Royal Portrush • Round 1
              </p>

              <button className="mt-6 rounded-lg bg-green-500 px-4 py-2 font-semibold text-slate-900 hover:bg-green-400">
                View Leaderboard
              </button>
            </div>

            {/* Featured Player */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm uppercase tracking-widest text-green-400">
                Featured Player
              </p>

              <h3 className="mt-3 text-2xl font-bold">
                Scottie Scheffler
              </h3>

              <p className="mt-2 text-slate-400">
                World No.1 • Form 🔥🔥🔥🔥🔥
              </p>

              <button className="mt-6 rounded-lg bg-green-500 px-4 py-2 font-semibold text-slate-900 hover:bg-green-400">
                View Profile
              </button>
            </div>

            {/* Latest News */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm uppercase tracking-widest text-green-400">
                Latest News
              </p>

              <ul className="mt-4 space-y-4">
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

          </div>
        </main>
      </div>
    </div>
  );
}