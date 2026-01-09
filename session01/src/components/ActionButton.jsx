import { useThemeContext } from "../theme/ThemeContextProvider";

export function ActionButton({ icon, label, onClick }) {
  const { mode } = useThemeContext();
  const isLight = mode === "light";

  return (
    <button
      onClick={onClick}
      className={
        isLight
          ? `
            rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-center
            border border-slate-200 bg-white shadow-sm transition
            hover:bg-slate-50 hover:shadow-md
          `
          : `
            rounded-xl bg-white/10 hover:bg-white/20 transition
            p-4 flex flex-col items-center justify-center gap-2 text-white
          `
      }
    >
      <div className={isLight ? "text-cyan-500" : "text-cyan-400"}>
        {icon}
      </div>

      <div className={isLight ? "text-sm font-semibold text-slate-700" : "text-sm font-semibold text-white/70"}>
        {label}
      </div>
    </button>
  );
}
