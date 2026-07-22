export default function DashboardCard({ card, setPage }) {
  const Icon = card.icon;

  const handleClick = () => {
    switch (card.title) {
      case "World Rankings":
        setPage("world-rankings");
        break;

      case "Player Search":
        setPage("player-search");
        break;

      case "Live Tournaments":
        setPage("schedule");
        break;

      case "Statistics":
        setPage("statistics");
        break;

      case "Predictions":
        setPage("predictions");
        break;

      case "GOAT Rankings":
        setPage("goat-rankings");
        break;

      default:
        break;
    }
  };

  return (
    <button
      onClick={handleClick}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left transition duration-300 hover:scale-105 hover:border-green-400"
    >
      <Icon className="mb-4 h-10 w-10 text-green-400" />

      <h2 className="text-2xl font-bold">{card.title}</h2>

      <p className="mt-2 text-slate-400">{card.desc}</p>
    </button>
  );
}