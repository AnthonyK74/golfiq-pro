import { loadTournamentHistory } from "./historyService";

/**
 * Returns factual course-form summaries.
 *
 * FACTS ONLY.
 * No ratings.
 * No weightings.
 * No confidence.
 */
export async function loadCourseForm(tournament) {
  const rounds = await loadTournamentHistory(tournament);

  const players = new Map();

  for (const round of rounds) {
    const player = round.player;

    if (!player) continue;

    if (!players.has(player.id)) {
      players.set(player.id, {
        player,

        starts: 0,
        cutsMade: 0,
        wins: 0,
        top10s: 0,

        bestFinish: null,
        totalFinish: 0,
        finishes: 0,

        lastSeason: 0,
      });
    }

    console.log(round);
break;

    const summary = players.get(player.id);

    // Count each tournament once
    if (round.round_number === 1) {
      summary.starts++;

      if (
        round.position !== null &&
        round.position !== undefined
      ) {
        const finish = Number(round.position);

        if (!Number.isNaN(finish)) {
          summary.totalFinish += finish;
          summary.finishes++;

          if (
            summary.bestFinish === null ||
            finish < summary.bestFinish
          ) {
            summary.bestFinish = finish;
          }

          if (finish === 1) summary.wins++;

          if (finish <= 10) summary.top10s++;
        }
      }

      if (round.made_cut) {
        summary.cutsMade++;
      }

      if (
        round.season &&
        round.season > summary.lastSeason
      ) {
        summary.lastSeason = round.season;
      }
    }
  }

  return Array.from(players.values()).map((player) => ({
    ...player,
    averageFinish:
      player.finishes > 0
        ? Number(
            (
              player.totalFinish /
              player.finishes
            ).toFixed(1)
          )
        : null,
  }));
}