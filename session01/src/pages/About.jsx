import { useMemo } from "react";
import { Stat } from "../components/Stat";
import { Badge } from "../components/Badge";
import { Feature } from "../components/Feature";

export default function About() {
  const stack = useMemo(
    () => [
      { name: "React", desc: "UI moderne & composants réutilisables" },
      { name: "Vite", desc: "Dev server rapide + build optimisé" },
      { name: "TailwindCSS", desc: "Styles rapides & cohérents" },
      { name: "MUI DataGrid", desc: "Tables, pagination, tri, sélection" },
      { name: "Node/Express", desc: "API REST pour gérer les données" },
      { name: "MongoDB", desc: "Base NoSQL pour étudiants, notes, matières" },
    ],
    []
  );

  return (
    <section className="w-full px-4 py-10 md:py-16">
      {/* Card principale */}
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur">
        {/* Header */}
        <div className="relative px-6 py-10 md:px-10 md:py-12">
          {/* glow */}
          <div className="pointer-events-none absolute -top-24 right-10 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-widest text-white/60">
                À PROPOS
              </p>
              <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
                Student Management
                <span className="bg-linear-to-r from-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
                  {" "}
                  • React App
                </span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
                Une application d’apprentissage pour gérer{" "}
                <span className="text-white">étudiants</span>,{" "}
                <span className="text-white">matières</span> et{" "}
                <span className="text-white">notes</span>, avec une interface
                claire, rapide et agréable.
              </p>
            </div>

            <div className="flex gap-3">
              <a
                href="#features"
                className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 transition"
              >
                Fonctionnalités
              </a>
              <a
                href="#stack"
                className="rounded-2xl bg-linear-to-r from-fuchsia-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90 transition"
              >
                Tech stack
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Stat title="Rapide" value="Vite" hint="Démarrage & refresh instantanés" />
            <Stat title="Tables" value="MUI DataGrid" hint="Pagination, tri, sélection" />
            <Stat title="API" value="REST" hint="Express + MongoDB (local/cloud)" />
          </div>
        </div>

        {/* Body */}
        <div className="border-t border-white/10 px-6 py-10 md:px-10">
          {/* Features */}
          <div id="features" className="scroll-mt-24">
            <h2 className="text-xl font-bold text-white">Fonctionnalités</h2>
            <p className="mt-2 text-sm text-white/70">
              L’objectif : une app simple, lisible, et prête à évoluer.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Feature
                title="Gestion des notes"
                desc="Lister, filtrer et parcourir les notes rapidement via DataGrid."
              />
              <Feature
                title="Gestion des étudiants"
                desc="Visualiser les étudiants avec une table responsive et claire."
              />
              <Feature
                title="Gestion des matières"
                desc="Affichage distinct des cours/matières (sans doublons)."
              />
              <Feature
                title="Architecture propre"
                desc="Composants réutilisables + pages lisibles + séparation UI/API."
              />
            </div>
          </div>

          {/* Stack */}
          <div id="stack" className="mt-12 scroll-mt-24">
            <h2 className="text-xl font-bold text-white">Tech stack</h2>
            <p className="mt-2 text-sm text-white/70">
              Les outils utilisés pour construire l’application.
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {stack.map((s) => (
                <div
                  key={s.name}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white">{s.name}</p>
                    <span className="text-xs text-white/50 group-hover:text-white/70 transition">
                      ✔
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-white/70">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer / Contact */}
          <div className="mt-12 flex flex-col gap-4 rounded-2xl border border-white/10 bg-linear-to-r from-white/5 to-white/0 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Auteur</p>
              <p className="text-sm text-white/70">
                Stanley • Projet “Introduction à React”
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge>UI: Tailwind</Badge>
              <Badge>Tables: DataGrid</Badge>
              <Badge>DB: MongoDB</Badge>
              <Badge>API: Express</Badge>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}


