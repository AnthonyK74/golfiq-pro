import { getTournaments } from "./golfApi.js";

import {
  saveTournament,
  savePlayer,
} from "../src/database/repository.js";

import {
  initialiseDatabase,
} from "../src/database/schema.js";

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

export async function importSeason(season) {
  console.log(`\n========== IMPORTING ${season} ==========`);

  initialiseDatabase();

  const response = await getTournaments(season);

  const tournaments =
    response.data ?? response.results ?? [];

  console.log(`Found ${tournaments.length} tournaments`);

  for (const tournament of tournaments) {
    saveTournament(mapTournament(tournament));

    const players = tournament.players ?? [];

    for (const player of players) {
      savePlayer(player);
    }

    console.log(`✓ ${tournament.name}`);
  }
}

export async function importHistory() {
  await importSeason(2024);
  await importSeason(2025);
  await importSeason(2026);

  console.log("\n🏆 Import complete.");
}