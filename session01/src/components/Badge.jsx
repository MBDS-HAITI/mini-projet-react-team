export function Badge({ children }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
      {children}
    </span>
  );
}
