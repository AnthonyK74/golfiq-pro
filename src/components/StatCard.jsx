export default function StatCard({
  title,
  value,
  subtitle = "",
  color = "green",
}) {
  const colourClasses = {
    green: "text-green-400",
    blue: "text-sky-400",
    amber: "text-amber-400",
    red: "text-red-400",
    white: "text-white",
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
      <div className="text-sm uppercase tracking-wide text-slate-400">
        {title}
      </div>

      <div
        className={`mt-3 text-4xl font-bold ${
          colourClasses[color] ?? colourClasses.green
        }`}
      >
        {value}
      </div>

      {subtitle && (
        <div className="mt-2 text-sm text-slate-500">
          {subtitle}
        </div>
      )}
    </div>
  );
}