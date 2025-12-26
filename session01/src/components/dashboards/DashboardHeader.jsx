export default function DashboardHeader({title,description, level}) {
    return (
        <div className="flex items-end justify-between gap-4">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                    {title}
                </h1>
                <p className="mt-1 text-sm text-white/50">
                    {description}
                </p>
            </div>

            {/* Little badge */}
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur-xl">
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400" />
                 {level}
            </div>
        </div>
    )
}         
//Dashboard Admin
//  Vue globale & actions rapides
//ADMIN