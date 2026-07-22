import { getTournaments } from "./golfApi";
import { saveTournament } from "../database/repository";
import { initialiseDatabase } from "../database/schema";

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

  let imported = 0;

  try {
    const response = await getTournaments(season);

    const tournaments = response.data ?? response.results ?? [];

    console.log(`Found ${tournaments.length} tournaments`);

    for (const tournament of tournaments) {
      saveTournament(mapTournament(tournament));

      imported++;

      console.log(
        `[${imported}/${tournaments.length}] ${tournament.name}`
      );
    }

    console.log(`\n✅ ${season} import complete`);
    console.log(`Imported ${imported} tournaments`);
  } catch (err) {
    console.error(err);
  }
}

export async function importHistory() {
  await importSeason(2024);
  await importSeason(2025);
  await importSeason(2026);

  console.log("\n🏆 Historical tournament import complete.");
}