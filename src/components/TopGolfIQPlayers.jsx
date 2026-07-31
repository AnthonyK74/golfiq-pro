export default function TopGolfIQPlayers({ players = [] }) {
  const topPlayers = [...players]
    .sort(
      (a, b) =>
        (b.golfIQ?.rating ?? 0) -
        (a.golfIQ?.rating ?? 0)
    )
    .slice(0, 5);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <h2 className="mb-6 text-2xl font-bold text-green-400">
        ⭐ Top GolfIQ Players
      </h2>

      <table className="w-full">

        <thead>

          <tr className="border-b border-slate-700">

            <th className="pb-3 text-left">#</th>
            <th className="pb-3 text-left">Player</th>
            <th className="pb-3 text-right">GolfIQ</th>

          </tr>

        </thead>

        <tbody>

          {topPlayers.map((player, index) => (

            <tr
              key={player.player.id}
              className="border-b border-slate-800"
            >

              <td className="py-3 font-bold text-green-400">
                {index + 1}
              </td>

              <td>
                {player.player.display_name}
              </td>

              <td className="text-right font-bold">

                {player.golfIQ.rating.toFixed(1)}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}