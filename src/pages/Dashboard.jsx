import DashboardCard from "../components/DashboardCard";

import {
  Trophy,
  Search,
  Calendar,
  BarChart3,
  Target,
  Star,
} from "lucide-react";

export default function Dashboard() {
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
    <>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <DashboardCard
            key={card.title}
            card={card}
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
  );
}