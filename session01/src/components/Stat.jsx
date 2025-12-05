export function Stat({
  title, value, hint,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs font-semibold text-white/60">{title}</p>
      <p className="mt-1 text-lg font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-white/60">{hint}</p>
    </div>
  );
}
