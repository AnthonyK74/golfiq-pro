import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.VITE_BALLDONTLIE_API_KEY;

if (!API_KEY) {
  throw new Error("VITE_BALLDONTLIE_API_KEY not found.");
}

async function getSeason(season) {
  let tournaments = [];
  let cursor = null;

  do {
    const url = new URL(
      "https://api.balldontlie.io/pga/v2/tournaments"
    );

    url.searchParams.set("season", season);
    url.searchParams.set("per_page", 100);

    if (cursor) {
      url.searchParams.set("cursor", cursor);
    }

    const response = await fetch(url, {
      headers: {
        Authorization: API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to load season ${season}: ${response.status}`
      );
    }

    const json = await response.json();

    tournaments.push(...(json.data ?? []));

    cursor = json.meta?.next_cursor ?? null;
  } while (cursor);

  return tournaments;
}

async function main() {
  const seasons = [2024, 2025, 2026];

  const excludedNames = [
    // Opposite-field events
    "Puerto Rico Open",
    "ONEflight Myrtle Beach Classic",
    "Myrtle Beach Classic",
    "ISCO Championship",
    "Corales Puntacana Championship",
    "Barracuda Championship",

    // Team / International
    "Ryder Cup",
    "Presidents Cup",
    "Men's Olympic Golf Competition",
    "Men’s Olympic Golf Competition",

    // Invitationals
    "Hero World Challenge",
    "Grant Thornton Invitational",

    // Development
    "PGA TOUR Q-School presented by Korn Ferry",

    // Other non-validation events
    "Good Good Championship",
    "Bank of Utah Championship",
    "Biltmore Championship Asheville",
    "Procore Championship",
    "Sanderson Farms Championship",
    "Black Desert Championship",
    "Shriners Children's Open",
    "ZOZO CHAMPIONSHIP"
  ];

  const officialSchedule = {};

  for (const season of seasons) {
    console.log(`\nLoading ${season}...`);

    let tournaments = await getSeason(season);

    tournaments = tournaments
      .sort(
        (a, b) =>
          new Date(a.start_date) -
          new Date(b.start_date)
      )
      .filter((tournament) => {
        return !excludedNames.some((name) =>
          tournament.name
            .toLowerCase()
            .includes(name.toLowerCase())
        );
      });

    officialSchedule[season] = tournaments.map((tournament) => ({
      id: tournament.id,
      season: tournament.season,
      name: tournament.name,
      start_date: tournament.start_date,
      end_date: tournament.end_date
    }));

    console.table(
      officialSchedule[season].map((t) => ({
        id: t.id,
        name: t.name,
        start: t.start_date
      }))
    );
  }

  fs.writeFileSync(
    "./src/data/officialSchedule.json",
    JSON.stringify(officialSchedule, null, 2),
    "utf8"
  );

  console.log(
    "\n✅ officialSchedule.json created successfully."
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});