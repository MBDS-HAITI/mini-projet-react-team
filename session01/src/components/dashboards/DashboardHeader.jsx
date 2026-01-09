export default function DashboardHeader({ title, description, level }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-white/50">
          {description}
        </p>
      </div>

      <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:backdrop-blur-xl">
        <span className="h-2 w-2 rounded-full bg-linear-to-r from-fuchsia-500 to-cyan-400" />
        {level}
      </div>
    </div>
  );
}
