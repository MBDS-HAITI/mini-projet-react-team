// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Loading from "../../components/common/Loading";
import { useAuth } from "../../auth/AuthProvider";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/home";

  const [form, setForm] = useState({
    username: "admin",
    password: "Admin123#",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Loading
        fullScreen
        title="Connexion sécurisée"
        subtitle="Vérification de vos identifiants…"
      />
    );
  }

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
                  Espace sécurisé
                </p>

                <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">
                  Connexion {" "}
                  <span
                    className="bg-linear-to-r from-fuchsia-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent"
                  >
                    Student Management
                  </span>
                </h1>

                <p className="mt-3 text-white/70 max-w-xl leading-relaxed">
                  Connecte-toi pour accéder à la gestion des étudiants, matières et notes.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/15 text-white/80">
                    Auth: JWT + Refresh
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/15 text-white/80">
                    UI: Glass + Gradient
                  </span>
                </div>
              </div>

              {/* icon bubble */}
              <div className="shrink-0 self-start">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 grid place-items-center">
                  <span className="text-2xl">🧑‍💻</span>
                </div>
              </div>
            </div>

            {/* divider */}
            <div className="mt-8 h-px bg-white/10" />

            {/* Error */}
            {error && (
              <div className="mt-6 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-sm mb-1 text-white/70">
                  Nom d’utilisateur
                </label>
                <input
                  type="text"
                  name="username"
                  required
                  value={form.username}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-white placeholder:text-white/30
                             focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40 focus:border-white/20 transition"
                  placeholder="ex: stanley"
                  autoComplete="username"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-sm mb-1 text-white/70">
                  Mot de passe
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-white placeholder:text-white/30
                             focus:outline-none focus:ring-2 focus:ring-cyan-300/40 focus:border-white/20 transition"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>

              {/* helper row */}
              <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mt-1">
                <p className="text-white/55 text-sm">
                  Astuce: utilise ton compte <span className="text-white/80 font-medium">admin</span> pour tester.
                </p>

              </div>

              {/* actions */}
              <div className="sm:col-span-2 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end mt-2">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 rounded-md text-sm font-semibold
                             bg-white/10 hover:bg-white/15 active:bg-white/20
                             border border-white/15 hover:border-white/25
                             text-white transition"
                >
                  ← Retour
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-md text-sm font-semibold text-white transition
                             bg-[#432866]/60 hover:bg-[#432866]/80
                             border border-white/15 shadow-[0_0_18px_rgba(234,0,255,0.18),0_0_18px_rgba(3,213,255,0.12)]"
                >
                  🔐 Se connecter
                </button>
              </div>
            </form>
          </div>

          {/* bottom gradient line */}
          <div className="h-1 bg-linear-to-r from-fuchsia-500/60 via-purple-500/60 to-cyan-400/60" />
        </div>
      </div>
    </div>
  );
}
