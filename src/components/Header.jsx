export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-900">
      <div className="flex items-center justify-between px-8 py-5">
        <div>
          <h2 className="text-3xl font-bold">
            Dashboard
          </h2>

          <p className="text-slate-400">
            Welcome to GolfIQ Analytics
          </p>
        </div>

        <div className="flex items-center gap-4">
          <input
            placeholder="Search golfers..."
            className="rounded-xl bg-slate-800 px-4 py-2 outline-none focus:ring-2 focus:ring-green-400"
          />

          <button className="rounded-xl bg-green-500 px-5 py-2 font-bold text-slate-950 hover:bg-green-400">
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
}