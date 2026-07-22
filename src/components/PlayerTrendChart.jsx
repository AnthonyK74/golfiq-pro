import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function PlayerTrendChart({
  rounds,
  title,
  dataKey,
}) {
  if (!rounds || rounds.length === 0) {
    return null;
  }

  const chartData = [...rounds]
    .slice(-5)
    .map((round, index) => ({
      round: index + 1,
      value: Number(round[dataKey] ?? 0),
    }));

  return (
    <div className="rounded-xl bg-slate-900 p-6 shadow-lg">
      <h3 className="mb-4 text-xl font-bold text-green-400">
        {title}
      </h3>

      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="round" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="value"
              strokeWidth={3}
              dot
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}