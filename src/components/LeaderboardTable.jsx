import { useNavigate } from "react-router-dom";
import { calculateGolfIQRating } from "../services/golfiqRating";

export default function LeaderboardTable({
  players = [],
  title = "Leaderboard",
  showRating = true,
  showCGI = true,
  showSG = true,
  showTrend = true,
  limit,
}) {
  const navigate = useNavigate();

  const leaderboard = limit
    ? players.slice(0, limit)
    : players;

  function medal(rank) {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">

      <div className="border-b border-slate-800 px-6 py-5">

        <h2 className="text-2xl font-bold text-green-400">
          {title}
        </h2>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-950">

            <tr>

              <th className="px-5 py-4 text-left">
                Rank
              </th>

              <th className="px-5 py-4 text-left">
                Player
              </th>

              <th className="px-5 py-4 text-center">
                Country
              </th>

              {showRating && (
                <th className="px-5 py-4 text-center">
                  Rating
                </th>
              )}

              {showCGI && (
                <th className="px-5 py-4 text-center">
                  CGI
                </th>
              )}

              {showSG && (
                <th className="px-5 py-4 text-center">
                  SG Total
                </th>
              )}

              {showTrend && (
                <th className="px-5 py-4 text-center">
                  Trend
                </th>
              )}

            </tr>

          </thead>

          <tbody>

            {leaderboard.map((player, index) => {

              const {
                rating,
                colour,
              } = calculateGolfIQRating(player);

              return (

                <tr
                  key={player.player.id}
                  onClick={() =>
                    navigate(`/player/${player.player.id}`)
                  }
                  className="cursor-pointer border-t border-slate-800 transition hover:bg-slate-800"
                >

                  <td className="px-5 py-4 font-bold text-green-400">

                    {medal(index + 1)}

                  </td>

                  <td className="px-5 py-4 font-semibold text-white">

                    {player.player.display_name}

                  </td>

                  <td className="px-5 py-4 text-center">

                    {player.player.country}

                  </td>

                  {showRating && (

                    <td
                      className={`px-5 py-4 text-center font-bold ${colour}`}
                    >

                      {rating.toFixed(1)}

                    </td>

                  )}

                  {showCGI && (

                    <td className="px-5 py-4 text-center">

                      {player.averages.cgi.toFixed(2)}

                    </td>

                  )}

                  {showSG && (

                    <td className="px-5 py-4 text-center">

                      {player.averages.sg_total.toFixed(2)}

                    </td>

                  )}

                  {showTrend && (

                    <td className="px-5 py-4 text-center">

                      {player.trend ?? "➡ Stable"}

                    </td>

                  )}

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>

      <div className="border-t border-slate-800 bg-slate-950 px-6 py-4 text-sm text-slate-400">

        Showing {leaderboard.length} golfers

      </div>

    </div>
  );
}