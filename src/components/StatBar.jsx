export default function StatBar({
  label,
  value,
  max = 100,
  color = "#22c55e",
}) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
          color: "white",
          fontWeight: 600,
        }}
      >
        <span>{label}</span>
        <span>{value}%</span>
      </div>

      <div
        style={{
          width: "100%",
          height: 12,
          background: "#1e293b",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background: color,
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}