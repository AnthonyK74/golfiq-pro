import db from "./database.js";

// ---------- PLAYERS ----------

export function savePlayer(player) {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO players (
      id,
      first_name,
      last_name,
      country
    )
    VALUES (?, ?, ?, ?)
  `);

  stmt.run(
    player.id,
    player.first_name,
    player.last_name,
    player.country
  );
}

export function getAllPlayers() {
  return db.prepare(`
    SELECT *
    FROM players
    ORDER BY last_name, first_name
  `).all();
}

// ---------- TOURNAMENTS ----------

export function saveTournament(tournament) {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO tournaments (
      id,
      name,
      season,
      course_name,
      start_date,
      end_date
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    tournament.id,
    tournament.name,
    tournament.season,
    tournament.course_name,
    tournament.start_date,
    tournament.end_date
  );
}

export function getTournaments() {
  return db.prepare(`
    SELECT *
    FROM tournaments
    ORDER BY start_date DESC
  `).all();
}

// ---------- RESULTS ----------

export function saveResult(result) {
  const stmt = db.prepare(`
    INSERT INTO results (
      tournament_id,
      player_id,
      position,
      total_score
    )
    VALUES (?, ?, ?, ?)
  `);

  stmt.run(
    result.tournament_id,
    result.player_id,
    result.position,
    result.total_score
  );
}

// ---------- ROUND STATS ----------

export function saveRoundStat(stat) {
  const stmt = db.prepare(`
    INSERT INTO round_stats (
      tournament_id,
      player_id,
      round_number,
      sg_off_tee,
      sg_approach,
      sg_around_green,
      sg_putting,
      sg_total
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    stat.tournament_id,
    stat.player_id,
    stat.round_number,
    stat.sg_off_tee,
    stat.sg_approach,
    stat.sg_around_green,
    stat.sg_putting,
    stat.sg_total
  );
}