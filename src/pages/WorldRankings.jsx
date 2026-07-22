export default function WorldRankings({ setPage }) {
  const players = [
    { rank: 1, name: "Scottie Scheffler", country: "🇺🇸" },
    { rank: 2, name: "Rory McIlroy", country: "🇬🇧" },
    { rank: 3, name: "Xander Schauffele", country: "🇺🇸" },
    { rank: 4, name: "Collin Morikawa", country: "🇺🇸" },
    { rank: 5, name: "Ludvig Åberg", country: "🇸🇪" },
    { rank: 6, name: "Hideki Matsuyama", country: "🇯🇵" },
    { rank: 7, name: "Tommy Fleetwood", country: "🇬🇧" },
    { rank: 8, name: "Patrick Cantlay", country: "🇺🇸" },
    { rank: 9, name: "Viktor Hovland", country: "🇳🇴" },
    { rank: 10, name: "Justin Thomas", country: "🇺🇸" },
  ];
console.log("setPage =", setPage);
  return (
    <div>
      <button
  onClick={() => {
    console.log("Back button clicked");
    setPage("dashboard");
  }}
  className="mb-8 rounded-xl bg-green-500 px-5 py-3 font-bold text-slate-900 shadow-lg hover:bg-green-400"
>
  ← Back to Dashboard
      </button>

      <h1 className="mb-2 text-4xl font-bold">🏆 World Rankings</h1>

      <p className="mb-8 text-slate-400">
        Current Top 10 Golfers
      </p>

      <div className="overflow-hidden rounded-xl border border-slate-800">
        <table className="w-full">
          <thead className="bg-slate-900">
            <tr>
              <th className="p-4 text-left">Rank</th>
              <th className="p-4 text-left">Player</th>
              <th className="p-4 text-left">Country</th>
            </tr>
          </thead>

          <tbody>
            {players.map((player) => (
              <tr
                key={player.rank}
                className="border-t border-slate-800 hover:bg-slate-900"
              >
                <td className="p-4 font-bold text-green-400">
                  {player.rank}
                </td>

                <td className="p-4">{player.name}</td>

                <td className="p-4 text-2xl">{player.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}