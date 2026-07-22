import db from "./database.js";

export function initialiseDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY,
      first_name TEXT,
      last_name TEXT,
      country TEXT
    );

    CREATE TABLE IF NOT EXISTS tournaments (
      id INTEGER PRIMARY KEY,
      name TEXT,
      season INTEGER,
      course_name TEXT,
      start_date TEXT,
      end_date TEXT
    );

    CREATE TABLE IF NOT EXISTS results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tournament_id INTEGER,
      player_id INTEGER,
      position TEXT,
      total_score INTEGER,
      FOREIGN KEY (tournament_id) REFERENCES tournaments(id),
      FOREIGN KEY (player_id) REFERENCES players(id)
    );

    CREATE TABLE IF NOT EXISTS round_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tournament_id INTEGER,
      player_id INTEGER,
      round_number INTEGER,
      sg_off_tee REAL,
      sg_approach REAL,
      sg_around_green REAL,
      sg_putting REAL,
      sg_total REAL,
      FOREIGN KEY (tournament_id) REFERENCES tournaments(id),
      FOREIGN KEY (player_id) REFERENCES players(id)
    );
  `);

  console.log("✅ GolfIQ database initialised");
}