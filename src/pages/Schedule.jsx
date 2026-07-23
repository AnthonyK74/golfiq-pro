import { useNavigate } from "react-router-dom";

export default function Schedule() {
  const navigate = useNavigate();

  const tournaments = [
    {
      id: 1,
      name: "The Open Championship",
      course: "Royal Birkdale",
      location: "Southport, England",
      dates: "16–19 July",
      purse: "$17,000,000",
      champion: "Xander Schauffele",
      status: "Current Tournament",
    },
    {
      id: 2,
      name: "3M Open",
      course: "TPC Twin Cities",
      location: "Blaine, Minnesota",
      dates: "23–26 July",
      purse: "$8,400,000",
      champion: "Jhonattan Vegas",
      status: "Next Event",
    },
    {
      id: 3,
      name: "Wyndham Championship",
      course: "Sedgefield Country Club",
      location: "Greensboro, North Carolina",
      dates: "30 July–2 August",
      purse: "$8,200,000",
      champion: "Aaron Rai",
      status: "Upcoming",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl">

      <button
        onClick={() => navigate("/")}
        className="mb-8 rounded-xl bg-green-500 px-5 py-3 font-bold text-slate-900 hover:bg-green-400"
      >
        ← Dashboard
      </button>

      <h1 className="text-4xl font-bold text-green-400">
        📅 Tournament Schedule
      </h1>

      <p className="mb-10 mt-2 text-slate-400">
        Browse current and upcoming PGA Tour events.
      </p>

      <div className="space-y-6">

        {tournaments.map((event) => (

          <div
            key={event.id}
            className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-green-500 hover:bg-slate-800"
            onClick={() => alert(`${event.name} Tournament Hub coming soon`)}
          >

            <div className="flex flex-col justify-between gap-4 lg:flex-row">

              <div>

                <div className="mb-2 inline-block rounded-full bg-green-500 px-3 py-1 text-sm font-bold text-slate-900">
                  {event.status}
                </div>

                <h2 className="text-3xl font-bold text-white">
                  {event.name}
                </h2>

                <p className="mt-3 text-slate-300">
                  🏌️ {event.course}
                </p>

                <p className="text-slate-300">
                  📍 {event.location}
                </p>

              </div>

              <div className="grid grid-cols-2 gap-5 lg:min-w-[320px]">

                <InfoCard
                  title="Dates"
                  value={event.dates}
                />

                <InfoCard
                  title="Purse"
                  value={event.purse}
                />

                <InfoCard
                  title="Defending Champion"
                  value={event.champion}
                />

                <InfoCard
                  title="Tournament Hub"
                  value="Coming Soon"
                />

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="rounded-xl bg-slate-950 p-4">

      <div className="text-sm text-slate-400">
        {title}
      </div>

      <div className="mt-2 font-bold text-green-400">
        {value}
      </div>

    </div>
  );
}