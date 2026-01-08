export function ActionButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl bg-white/10 hover:bg-white/20 transition
                 p-4 flex flex-col items-center justify-center gap-2 text-white"
    >
      <div className="text-cyan-400">{icon}</div>
      <div className="text-sm font-semibold text-center">{label}</div>
    </button>
  );
}