export default function DashboardCard({ card, setPage }) {
  return (
    <button
      onClick={() => {
        if (card.title === "World Rankings") {
          setPage("world-rankings");
        } else {
          alert(`${card.title} coming soon!`);
        }
      }}
      className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left transition hover:-translate-y-1 hover:border-green-400 hover:shadow-xl"
    >
      <card.icon
        size={44}
        className="text-green-400 transition group-hover:scale-110"
      />

      <h3 className="mt-4 text-2xl font-bold">
        {card.title}
      </h3>

      <p className="mt-2 text-slate-400">
        {card.desc}
      </p>
    </button>
  );
}