// src/pages/not-found/NotFound.jsx
import { Link, useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl relative">
        {/* glow */}
        <div className="absolute -top-14 -left-10 w-72 h-72 bg-fuchsia-500/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-16 -right-12 w-72 h-72 bg-cyan-400/20 blur-3xl rounded-full" />

        {/* card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#2b1a55]/50 backdrop-blur shadow-2xl">
          <div className="p-6 sm:p-10">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div>
                <p className="text-white/60 text-sm tracking-wider uppercase">
                  Page introuvable
                </p>

                <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">
                  Not Found <span className="text-fuchsia-300">404</span>
                </h1>

                <p className="mt-3 text-white/70 max-w-xl leading-relaxed">
                  Oups… l’adresse que tu cherches n’existe pas (ou a été déplacée).
                  Vérifie l’URL ou retourne à l’accueil.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/15 text-white/80">
                    Hint: menu en haut
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/15 text-white/80">
                    URL incorrecte
                  </span>
                </div>
              </div>

              {/* icon bubble */}
              <div className="shrink-0 self-start">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 grid place-items-center">
                  <span className="text-2xl">🧭</span>
                </div>
              </div>
            </div>

            {/* divider */}
            <div className="mt-8 h-px bg-white/10" />

            <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="text-white/60 text-sm">
                Astuce: si tu viens d’une redirection, clique{" "}
                <span className="text-white/80 font-medium">Retour</span>.
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 rounded-md text-sm font-semibold
                             bg-white/10 hover:bg-white/15 active:bg-white/20
                             border border-white/15 hover:border-white/25
                             text-white transition"
                >
                  ← Retour
                </button>

                <Link
                  to="/home"
                  className="px-4 py-2 rounded-md text-sm font-semibold
                             bg-white text-[#2b1a55] hover:opacity-90 active:opacity-80
                             transition"
                >
                  Aller à l’accueil
                </Link>

                <Link
                  to="/about"
                  className="px-4 py-2 rounded-md text-sm font-semibold
                             bg-[#432866]/60 hover:bg-[#432866]/80
                             border border-white/15 text-white transition"
                >
                  À propos
                </Link>
              </div>
            </div>
          </div>

          {/* bottom gradient line */}
          <div className="h-1 bg-linear-to-r from-fuchsia-500/60 via-purple-500/60 to-cyan-400/60" />
        </div>
      </div>
    </div>
  );
}
