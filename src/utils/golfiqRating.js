export function calculateGolfIQ(player) {
  const sgOtt = Number(player.sg_off_tee ?? 0);
  const sgApp = Number(player.sg_approach ?? 0);
  const sgArg = Number(player.sg_around_green ?? 0);
  const sgPutt = Number(player.sg_putting ?? 0);

  // Combined Golf Index
  const cgi =
    (1.5 * sgApp) +
    (1.2 * sgOtt) +
    (1.0 * sgPutt) +
    (0.8 * sgArg);

  return {
    rating: cgi,
    cgi,
    sgOtt,
    sgApp,
    sgArg,
    sgPutt,
  };
}