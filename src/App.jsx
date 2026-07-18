export default function App() {
  const cards = [
    { title: "World Rankings", icon: "🏆" },
    { title: "Player Search", icon: "🔍" },
    { title: "Tournament Schedule", icon: "📅" },
    { title: "Statistics", icon: "📊" },
    { title: "GOAT Rankings", icon: "⭐" },
    { title: "Compare Players", icon: "⚖️" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
          <div>
            <h1 className="text-3xl font-bold text-green-400">🏌️ GolfIQ</h1>
            <p className="text-slate-400">
              Professional Golf Analytics
            </p>
          </div>

          <button className="rounded-lg bg-green-500 px-4 py-2 font-semibold text-slate-900 hover:bg-green-400">
            Sign In
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-8 py-8">
        <h2 className="mb-6 text-2xl font-bold">Dashboard</h2>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-green-400 hover:shadow-lg"
            >
              <div className="text-4xl">{card.icon}</div>

              <h3 className="mt-4 text-xl font-bold">
                {card.title}
              </h3>

              <p className="mt-2 text-slate-400">
                Explore this section
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <p className="text-sm uppercase tracking-widest text-green-400">
            Featured Player
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            Scottie Scheffler
          </h2>

          <p className="mt-2 text-slate-400">
            World No. 1 • Current Form: 🔥🔥🔥🔥🔥
          </p>

          <button className="mt-6 rounded-lg bg-green-500 px-5 py-3 font-semibold text-slate-900 hover:bg-green-400">
            View Profile
          </button>
        </div>
      </main>
    </div>
  );
}