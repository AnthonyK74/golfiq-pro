import { getTournaments, getPlayers } from "./golfApi.js";

import {
  saveTournament,
  savePlayer,
} from "../src/database/repository.js";

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

async function importPlayers() {
  console.log("\n========== IMPORTING PLAYERS ==========");

  let page = 1;
  let imported = 0;

  while (true) {
    const response = await getPlayers(page);

    const players = response.data ?? [];

    if (!players.length) break;

    for (const player of players) {
      savePlayer({
        id: player.id,
        first_name: player.first_name,
        last_name: player.last_name,
        country: player.country,
        amateur: player.amateur ? 1 : 0,
      });

      imported++;
    }

    console.log(`Players imported: ${imported}`);

    if (!response.meta?.next_page) break;

    page = response.meta.next_page;
  }

  console.log(`✅ Imported ${imported} players`);
}

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

export async function importHistory() {
  initialiseDatabase();

  await importPlayers();

  await importSeason(2024);
  await importSeason(2025);
  await importSeason(2026);

  console.log("\n🏆 Database import complete.");
}