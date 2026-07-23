// GolfIQ Formula
//
// GolfIQ =
// (1.5 × SG Approach)
// + (1.2 × SG Off The Tee)
// + (1.0 × SG Putting)
// + (0.8 × SG Around Green)

export function calculateGolfIQ(player) {
  const sgApproach = Number(player.sg_approach ?? 0);
  const sgOffTee = Number(player.sg_off_tee ?? 0);
  const sgAroundGreen = Number(player.sg_around_green ?? 0);
  const sgPutting = Number(player.sg_putting ?? 0);

  const golfIQ =
    (1.5 * sgApproach) +
    (1.2 * sgOffTee) +
    (1.0 * sgPutting) +
    (0.8 * sgAroundGreen);

  return Number(golfIQ.toFixed(3));
}

export function rankPlayers(players) {
  return players
    .map((player) => ({
      ...player,
      golfIQ: calculateGolfIQ(player),
    }))
    .sort((a, b) => b.golfIQ - a.golfIQ);
}

export function averagePlayerRatings(rounds) {
  const map = new Map();

  rounds.forEach((round) => {
    if (!round.player) return;

    const id = round.player.id;
    const rating = calculateGolfIQ(round);

    if (!map.has(id)) {
      map.set(id, {
        player: round.player,
        tournaments: 0,
        totalGolfIQ: 0,
      });
    }

    const golfer = map.get(id);

    golfer.tournaments += 1;
    golfer.totalGolfIQ += rating;
  });

  return Array.from(map.values())
    .map((golfer) => ({
      ...golfer,
      averageGolfIQ:
        golfer.totalGolfIQ / golfer.tournaments,
    }))
    .sort((a, b) => b.averageGolfIQ - a.averageGolfIQ);
}