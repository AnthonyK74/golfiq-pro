import { NavLink } from "react-router-dom";

const links = [
  { name: "🏠 Dashboard", path: "/" },

 { name: "📈 GolfIQ Power Rankings", path: "/golfiq" },

  { name: "🌍 World Rankings", path: "/world-rankings" },

  { name: "👤 Player Search", path: "/player-search" },

  { name: "⚔️ Compare Players", path: "/compare" },

  { name: "📅 Tournament Schedule", path: "/schedule" },

  { name: "🎯 Predictions", path: "/predictions" },

  { name: "🏌️ Course Fit", path: "/course-fit" },

  { name: "⭐ GOAT Rankings", path: "/goat-rankings" },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-64 border-r border-slate-800 bg-slate-900 lg:flex lg:flex-col">
      <div className="border-b border-slate-800 p-6">
        <h1 className="text-3xl font-bold text-green-400">
          🏌️ GolfIQ
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Professional Golf Analytics
        </p>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === "/"}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-3 font-medium transition-all duration-200 ${
                isActive
                  ? "bg-green-500 text-slate-900 shadow-lg"
                  : "text-slate-300 hover:bg-slate-800 hover:text-green-400"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <div className="rounded-xl bg-slate-800 p-4">
          <div className="text-sm font-semibold text-green-400">
            GolfIQ Pro
          </div>

          <div className="mt-2 text-xs text-slate-400">
            Analytics Engine
            <br />
            Ball Don't Lie PGA API
            <br />
            Last 5 Starts Model
          </div>
        </div>
      </div>
    </aside>
  );
}