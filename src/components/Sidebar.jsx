export default function Sidebar() {
  return (
    <aside className="hidden w-64 border-r border-slate-800 bg-slate-900 lg:flex lg:flex-col">
      <div className="border-b border-slate-800 p-6">
        <h1 className="text-3xl font-bold text-green-400">
          🏌️ GolfIQ
        </h1>
        <p className="text-sm text-slate-400">
          Professional Golf Analytics
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {[
          "Dashboard",
          "World Rankings",
          "Players",
          "Tournaments",
          "Statistics",
          "Predictions",
          "GOAT Rankings",
          "Settings",
        ].map((item) => (
          <button
            key={item}
            className="w-full rounded-xl px-4 py-3 text-left text-slate-300 transition hover:bg-green-500 hover:text-slate-950"
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
}