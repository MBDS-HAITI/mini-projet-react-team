// src/components/widgets/StatCard.jsx
export default function StatCard({
  title,
  value=100,
  subtitle,
  icon,
  hint,        // petit texte optionnel (ex: "+12 ce mois")
  valueColor = "text-cyan-300", // tu peux changer selon la card
}) {
  return (
    <div
      className="w-full m-2 rounded-xl overflow-hidden md:max-w-md transform transition duration-500 hover:scale-105
                 border border-white/10 bg-white/5 backdrop-blur-xl hover:shadow-fuchsia-600 hover:shadow-lg shadow-2xl shadow-black/40"
    >
      <div className="w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="uppercase tracking-wider text-sm font-bold text-white/70">
            {title}
          </div>

          {/* icon optionnel */}
          {icon ? (
            <div className="h-10 w-10 rounded-lg grid place-items-center border border-white/10 bg-white/5">
              <span className="text-fuchsia-300">{icon}</span>
            </div>
          ) : null}
        </div>

        {/* Value */}
        <div className="flex items-end justify-between gap-4">
          <div className={`text-4xl font-extrabold drop-shadow ${valueColor}`}>
            {value}
          </div>

          {subtitle ? (
            <div className="text-right">
              <div className="text-md text-white/50">{subtitle}</div>
              {hint ? (
                <div className="text-md text-white/60 mt-1">{hint}</div>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Accent row */}
        <div className="mt-5 flex items-center gap-2">
          <span className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
            <span className="block h-full w-2/5 bg-linear-to-r from-fuchsia-500 to-cyan-400" />
          </span>
          <span className="text-[10px] font-mono text-white/40 select-none">
            stat
          </span>
        </div>
      </div>
    </div>
  );
}
