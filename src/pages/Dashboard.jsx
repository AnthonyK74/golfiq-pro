import { useEffect, useState } from "react";

import DashboardCard from "../components/DashboardCard";
import StatCard from "../components/StatCard";

import { getDashboardData } from "../services/dashboardService";

import {
  Trophy,
  Search,
  Calendar,
  BarChart3,
  Target,
  Star,
} from "lucide-react";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getDashboardData();
        setDashboard(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

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

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        Loading GolfIQ Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div className="rounded-3xl border border-green-500 bg-gradient-to-r from-slate-900 to-slate-800 p-8">

        <h1 className="text-5xl font-bold text-green-400">
          🏌️ GolfIQ Pro
        </h1>

        <p className="mt-3 text-lg text-slate-300">
          Professional Golf Analytics Platform
        </p>

        <p className="mt-2 text-slate-400">
          Live PGA statistics powered by Ball Don't Lie
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="GolfIQ No.1"
          value={
            dashboard?.worldNo1
              ? `${dashboard.worldNo1.player.first_name} ${dashboard.worldNo1.player.last_name}`
              : "--"
          }
          subtitle="Highest GolfIQ Rating"
        />

        <StatCard
          title="Tournament Favourite"
          value={
            dashboard?.favourite
              ? `${dashboard.favourite.player.first_name} ${dashboard.favourite.player.last_name}`
              : "--"
          }
          subtitle="Prediction Engine"
        />

        <StatCard
          title="Hottest Player"
          value={
            dashboard?.hottestPlayer
              ? `${dashboard.hottestPlayer.player.first_name} ${dashboard.hottestPlayer.player.last_name}`
              : "--"
          }
          subtitle={
            dashboard?.hottestPlayer?.trend ?? ""
          }
        />

        <StatCard
          title="Best Course Fit"
          value={
            dashboard?.bestCourseFit
              ? dashboard.bestCourseFit.courseFit.score.toFixed(1)
              : "--"
          }
          subtitle={
            dashboard?.bestCourseFit
              ? `${dashboard.bestCourseFit.player.first_name} ${dashboard.bestCourseFit.player.last_name}`
              : ""
          }
        />

      </div>

      {dashboard?.nextTournament && (

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <h2 className="mb-4 text-2xl font-bold text-green-400">
            📅 Next Tournament
          </h2>

          <div className="text-xl font-semibold">
            {dashboard.nextTournament.name}
          </div>

          <div className="mt-2 text-slate-400">
            {dashboard.nextTournament.start_date}
          </div>

        </div>

      )}

      <div>

        <h2 className="mb-4 text-2xl font-bold text-green-400">
          Explore GolfIQ
        </h2>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {cards.map((card) => (
            <DashboardCard
              key={card.title}
              card={card}
            />
          ))}

        </div>

      </div>

      {dashboard?.leaderboard?.length > 0 && (

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <h2 className="mb-6 text-2xl font-bold text-green-400">
            📊 GolfIQ Top 10
          </h2>

          <table className="min-w-full">

            <thead>

              <tr className="border-b border-slate-700">

                <th className="px-4 py-3 text-left">
                  Rank
                </th>

                <th className="px-4 py-3 text-left">
                  Player
                </th>

                <th className="px-4 py-3 text-right">
                  CGI
                </th>

                <th className="px-4 py-3 text-center">
                  Trend
                </th>

              </tr>

            </thead>

            <tbody>

              {dashboard.leaderboard.map((player, index) => (

                <tr
                  key={player.player.id}
                  className="border-b border-slate-800"
                >

                  <td className="px-4 py-3 font-bold text-green-400">
                    {index + 1}
                  </td>

                  <td className="px-4 py-3">
                    {player.player.first_name}{" "}
                    {player.player.last_name}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {player.averages.cgi.toFixed(2)}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {player.trend}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}