

export function SummaryItem({ label, value, color = "text-white" }) {
  return (
    <div className="rounded-lg bg-white/10 p-4">
      <div className="text-xs text-white/60">{label}</div>
      <div className={`text-lg font-bold ${color}`}>{value}</div>
    </div>
  );
}