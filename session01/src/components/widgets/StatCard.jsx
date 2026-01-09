import { useThemeContext } from "../../theme/ThemeContextProvider";

export default function StatCard({
  title,
  value = 100,
  subtitle,
  icon,
  hint,
  valueColor = "text-cyan-300",
}) {
  const { mode } = useThemeContext();
  const isLight = mode === "light";

  return (
    <div
      className={
        isLight
          ? `
            w-full m-2 rounded-xl overflow-hidden md:max-w-md
            transform transition duration-500 hover:scale-105
            border border-slate-200 bg-white shadow-sm hover:shadow-md
          `
          : `
            w-full m-2 rounded-xl overflow-hidden md:max-w-md
            transform transition duration-500 hover:scale-105
            border border-white/10 bg-white/5 backdrop-blur-xl
            hover:shadow-fuchsia-600 hover:shadow-lg shadow-2xl shadow-black/40
          `
      }
    >
      <div className="w-full p-6">
        <div
          className={
            isLight
              ? "flex items-center justify-between border-b border-slate-200 pb-3 mb-4"
              : "flex items-center justify-between border-b border-white/10 pb-3 mb-4"
          }
        >
          <div
            className={
              isLight
                ? "uppercase tracking-wider text-sm font-bold text-slate-500"
                : "uppercase tracking-wider text-sm font-bold text-white/70"
            }
          >
            {title}
          </div>

          {icon ? (
            <div
              className={
                isLight
                  ? "h-10 w-10 rounded-lg grid place-items-center border border-slate-200 bg-slate-50"
                  : "h-10 w-10 rounded-lg grid place-items-center border border-white/10 bg-white/5"
              }
            >
              <span className={isLight ? "text-fuchsia-500" : "text-fuchsia-300"}>
                {icon}
              </span>
            </div>
          ) : null}
        </div>

        <div className="flex items-end justify-between gap-4">
          <div
            className={`text-4xl font-extrabold drop-shadow ${
              isLight ? valueColor.replace("dark:", "") : valueColor
            }`}
          >
            {value}
          </div>

          {subtitle ? (
            <div className="text-right">
              <div className={isLight ? "text-md text-slate-500" : "text-md text-white/50"}>
                {subtitle}
              </div>

              {hint ? (
                <div className={isLight ? "text-md text-slate-400 mt-1" : "text-md text-white/60 mt-1"}>
                  {hint}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="mt-5 flex items-center gap-2">
          <span
            className={
              isLight
                ? "h-1.5 w-full rounded-full bg-slate-100 overflow-hidden"
                : "h-1.5 w-full rounded-full bg-white/5 overflow-hidden"
            }
          >
            <span className="block h-full w-2/5 bg-linear-to-r from-fuchsia-500 to-cyan-400" />
          </span>

          <span
            className={
              isLight
                ? "text-[10px] font-mono text-slate-400 select-none"
                : "text-[10px] font-mono text-white/40 select-none"
            }
          >
            stat
          </span>
        </div>
      </div>
    </div>
  );
}
