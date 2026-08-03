import {
  saveTournament,
  savePlayer,
  saveResult,
  saveRoundStat,
  playerExists,
} from "../src/database/repository.js";
import {
  getTournaments,
  getPlayers,
  getTournamentResults,
  getTournamentStats,
} from "./golfApi.js";



import { initialiseDatabase } from "../src/database/schema.js";

function mapTournament(apiTournament) {
  return {
    id: apiTournament.id,
    name: apiTournament.name,
    season: apiTournament.season,
    course_name:
      apiTournament.course?.name ||
      apiTournament.course_name ||
      "Unknown Course",
    start_date: apiTournament.start_date,
    end_date: apiTournament.end_date,
  };
}

// --------------------------------------------------
// PLAYERS
// --------------------------------------------------

async function importPlayers() {
  console.log("\n========== IMPORTING PLAYERS ==========");

  let cursor = null;
  let imported = 0;
const seenCursors = new Set();
const seenPlayers = new Set();
  while (true) {
    const response = await getPlayers(cursor);

    const players = response.data ?? [];

    if (!players.length) break;

    for (const player of players) {
      if (seenPlayers.has(player.id)) {
      console.log(`Duplicate player detected: ${player.id}`);
      process.exit(0);
    }
      savePlayer({
        id: player.id,
        first_name: player.first_name,
        last_name: player.last_name,
        country: player.country,
        amateur: player.amateur ? 1 : 0,
      });

            if (player.id === 176) {
        console.log("✅ Imported Justin Rose");
      }

      imported++;
    }

    console.log(`Players imported: ${imported}`);

    console.log("Next cursor:", response.meta?.next_cursor);

    cursor = response.meta?.next_cursor;
    if (seenCursors.has(cursor)) {
  console.log("Cursor loop detected.");
  break;
}

seenCursors.add(cursor);
console.log("Next cursor:", cursor);
if (playerExists(176)) {
  console.log("✅ Justin Rose is in the database");
}
    if (!cursor) break;
  }

  console.log(`✅ Imported ${imported} players`);
}

// --------------------------------------------------
// TOURNAMENTS
// --------------------------------------------------

async function importSeason(season) {
  console.log(`\n========== IMPORTING ${season} ==========`);

  const response = await getTournaments(season);
  const tournaments = response.data ?? [];

  console.log(`Found ${tournaments.length} tournaments`);

  for (const tournament of tournaments) {
    saveTournament(mapTournament(tournament));

    console.log(`✓ ${tournament.name}`);
  }
}

// --------------------------------------------------
// RESULTS
// --------------------------------------------------

async function importResults(season) {
  console.log(
    `\n========== IMPORTING ${season} RESULTS ==========`
  );

  const response = await getTournaments(season);
  const tournaments = response.data ?? [];

  let imported = 0;

  for (const tournament of tournaments) {
    console.log(`Loading ${tournament.name}...`);

    let page = 1;

    while (true) {
      try {
        const resultsResponse =
          await getTournamentResults(
            tournament.id,
            page
          );

        const results = resultsResponse.data ?? [];

        if (!results.length) break;

        for (const result of results) {
          saveResult({
            tournament_id: tournament.id,
            player_id: result.player.id,
            position: result.position,
            total_score: result.total_score,
          });

          imported++;
        }

        if (!resultsResponse.meta?.next_page) break;

        page = resultsResponse.meta.next_page;
      } catch (err) {
        console.log(
          `No results for ${tournament.name}`
        );
        break;
      }
    }
  }

  console.log(`✅ Imported ${imported} results`);
}

// --------------------------------------------------
// ROUND STATS
// --------------------------------------------------

async function importRoundStats(season) {
  console.log(
    `\n========== IMPORTING ${season} ROUND STATS ==========`
  );

  const response = await getTournaments(season);
  const tournaments = response.data ?? [];

  let imported = 0;

  for (const tournament of tournaments) {
    console.log(`Loading ${tournament.name}...`);

    let page = 1;

    while (true) {
      try {
        const statsResponse =
          await getTournamentStats(
            tournament.id,
            page
          );

        const stats = statsResponse.data ?? [];

        if (!stats.length) break;

        for (const stat of stats) {
          if (!playerExists(stat.player.id)) {
    console.log(
      "Missing player:",
      stat.player.id,
      stat.player.display_name
    );
    process.exit(0);
  }
          saveRoundStat({
            tournament_id: tournament.id,
            player_id: stat.player.id,
            round_number: stat.round_number,
            sg_off_tee: stat.sg_off_tee,
            sg_approach: stat.sg_approach,
            sg_around_green: stat.sg_around_green,
            sg_putting: stat.sg_putting,
            sg_total: stat.sg_total,
          });

          imported++;
        }

        if (!statsResponse.meta?.next_page) break;

        page = statsResponse.meta.next_page;
      } catch (err) {
  console.log(
    `ERROR for ${tournament.name}`
  );

  console.error(err);

  break;
}
    }
  }

  console.log(
    `✅ Imported ${imported} round stats`
  );
}

// --------------------------------------------------
// FULL DATABASE IMPORT
// --------------------------------------------------

export async function importHistory() {
  initialiseDatabase();

  await importPlayers();

  await importSeason(2024);
  await importSeason(2025);
  await importSeason(2026);

  await importResults(2024);
  await importResults(2025);
  await importResults(2026);

  await importRoundStats(2024);
  await importRoundStats(2025);
  await importRoundStats(2026);

  console.log("\n🏆 Database import complete.");
}