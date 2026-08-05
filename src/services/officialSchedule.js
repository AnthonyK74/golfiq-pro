// Tournaments excluded from GolfIQ historical validation.
//
// These are official PGA Tour events but are opposite-field
// tournaments and are intentionally excluded so that
// player form is built only from the strongest fields.

export const EXCLUDED_EVENTS = [
  "ONEflight Myrtle Beach Classic",
  "ISCO Championship",
  "Corales Puntacana Championship",
];

export function isOfficialValidationEvent(tournament) {
  return !EXCLUDED_EVENTS.includes(tournament.name);
}