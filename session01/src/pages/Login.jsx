// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import Loading from "../components/common/Loading";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({
    username: "admin",
    password: "Admin123#",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Erreur de connexion"
      );
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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#140524]/70 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.45)] p-8">
        {/* Title */}
        <h1
          className="text-center text-4xl font-bold mb-2"
          style={{
            backgroundImage:
              "linear-gradient(40deg, #ea00ff, #ea00ff, #03d5ff, #03d5ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))",
          }}
        >
          Connexion
        </h1>

        <p className="text-center text-[#8964b0] mb-8">
          Accédez à votre espace sécurisé
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1 text-[#a18aba]">
              Nom d’utilisateur
            </label>
            <input
              type="text"
              name="username"
              required
              value={form.username}
              onChange={handleChange}
              className="w-full rounded-lg bg-[#1b082f] border border-white/10 px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#7925d3]"
              placeholder="ex: stanley"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-[#a18aba]">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg bg-[#1b082f] border border-white/10 px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#7925d3]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-6 rounded-xl py-3 font-semibold text-white transition-all"
            style={{
              backgroundImage:
                "linear-gradient(40deg, #7925d3, #ea00ff, #03d5ff)",
              boxShadow:
                "0 0 18px rgba(234,0,255,0.35), 0 0 18px rgba(3,213,255,0.25)",
            }}
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
