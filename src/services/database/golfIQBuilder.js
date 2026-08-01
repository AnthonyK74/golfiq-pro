function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

export function buildGolfIQ(players) {
  players.forEach((player) => {
    const golfIQ = player.golfIQ.rating;
    const cgi = player.golfIQ.cgi;
    const sgTotal = player.averages.sg_total ?? 0;

    const courseFit =
      player.courseFit?.score ?? 75;

    const confidence =
      player.confidence ?? 70;

    const ballStriking =
      golfIQ * 0.6 +
      courseFit * 0.4;

    const scoring =
      cgi * 4 +
      sgTotal * 6;

    const course = courseFit;

    const consistency =
      player.consistency ?? 70;

    const form = confidence;

    player.golfIQ.rawScore =
      ballStriking * 0.4 +
      scoring * 0.25 +
      course * 0.15 +
      consistency * 0.1 +
      form * 0.1;
  });

  const scores = players.map(
    (p) => p.golfIQ.rawScore
  );

  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const range = Math.max(max - min, 1);

  players.forEach((player) => {
    const score =
      (player.golfIQ.rawScore - min) /
      range;

    player.golfIQ.rating = Number(
      (60 + score * 40).toFixed(1)
    );
  });

  players.sort(
    (a, b) =>
      b.golfIQ.rating -
      a.golfIQ.rating
  );

  players.forEach((player, index) => {
    let grade = "B";

    if (index === 0) grade = "S";
    else if (index < 5) grade = "A+";
    else if (index < 10) grade = "A";
    else if (index < 20) grade = "A-";
    else if (index < 40) grade = "B+";

    player.golfIQ.grade = grade;
  });

  return players;
}