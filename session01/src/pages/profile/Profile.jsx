import React, { useMemo } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { formatDate } from "../../utils/fdate";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  const meta = useMemo(() => {
    if (!user) return null;
    const providerNames =
      user.providers?.length ? user.providers.map((p) => p.provider || p.name || p).join(", ") : "Aucun";
    return {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive ? "Actif" : "Inactif",
      mailVerified: user.mailVerified ? "Vérifié" : "Non vérifié",
      lastLoginAt: user.lastLoginAt ? formatDate(user.lastLoginAt) : "Jamais",
      createdAt: user.createdAt ? formatDate(user.createdAt) : "-",
      updatedAt: user.updatedAt ? formatDate(user.updatedAt) : "-",
      providers: providerNames,
      hasGoogle: (user.providers || []).some((p) => (p?.provider || p?.name || p) === "google"),
    };
  }, [user]);

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="w-full max-w-5xl mx-auto backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-7 w-48 bg-white/10 rounded" />
            <div className="h-4 w-72 bg-white/10 rounded" />
            <div className="h-40 bg-white/10 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!user || !meta) {
    return (
      <div className="p-4 md:p-8">
        <div className="w-full max-w-5xl mx-auto backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 text-white">
          <h1 className="text-2xl font-bold">Profil</h1>
          <p className="text-white/70 mt-2">Aucun utilisateur connecté.</p>
        </div>
      </div>
    );
  }

  const handleEditEmail = () => console.log("Edit email (autorisé)");
  const handleToggleActive = () => console.log("Toggle active (admin?)");
  const handleVerifyEmail = () => console.log("Send verify email");
  const handleResetPassword = () => console.log("Reset password");
  const handleLinkGoogle = () => {
    // idéalement: redirect vers ton endpoint backend OAuth Google
    // window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    console.log("Link Google provider");
  };
  const handleUnlinkGoogle = () => console.log("Unlink Google provider");

  return (
    <div className="p-4 md:p-8">
      <div className="w-full max-w-5xl mx-auto backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-white">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Mon profil
            </h1>
            <p className="text-white/70 mt-1">
              Gérez vos informations et vos méthodes de connexion.
            </p>
          </div>

          {/* Actions principales */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleResetPassword}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 active:bg-white/20
                         border border-white/15 hover:border-white/25 text-white text-sm font-semibold transition"
            >
              Changer mot de passe
            </button>

            <button
              onClick={handleVerifyEmail}
              className="px-4 py-2 rounded-lg bg-linear-to-r from-purple-500 to-indigo-500
                         hover:opacity-90 text-white text-sm font-semibold transition"
            >
              Vérifier email
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: identity card */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-5 text-white">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-linear-to-r from-purple-500/60 to-indigo-500/60 border border-white/20 flex items-center justify-center font-bold">
                  {(meta.username?.[0] || meta.email?.[0] || "U").toUpperCase()}
                </div>
                <div>
                  <div className="text-lg font-bold">{meta.username}</div>
                  <div className="text-white/70 text-sm">{meta.email}</div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <div className="text-white/60">Rôle</div>
                  <div className="font-semibold">{meta.role}</div>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <div className="text-white/60">Statut</div>
                  <div className="font-semibold">{meta.isActive}</div>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <div className="text-white/60">Email</div>
                  <div className="font-semibold">{meta.mailVerified}</div>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <div className="text-white/60">Dernière connexion</div>
                  <div className="font-semibold">{meta.lastLoginAt}</div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  onClick={handleEditEmail}
                  className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 active:bg-white/20
                             border border-white/15 hover:border-white/25 text-white text-sm font-semibold transition"
                >
                  Modifier email
                </button>

              </div>
            </div>

            {/* Audit */}
            <div className="mt-4 rounded-2xl border border-white/15 bg-white/5 p-5 text-white">
              <div className="text-sm font-bold">Informations</div>
              <div className="mt-3 text-sm text-white/80 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-white/60">Créé le</span>
                  <span>{meta.createdAt}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-white/60">Modifié le</span>
                  <span>{meta.updatedAt}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: providers + security */}
          <div className="lg:col-span-2 space-y-6">
            {/* Providers */}
            <div className="rounded-2xl border border-white/15 bg-white/5 p-5 text-white">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-bold">Méthodes de connexion</div>
                  <div className="text-white/70 text-sm mt-1">
                    Ajoutez Google pour vous connecter plus facilement.
                  </div>
                </div>

                <div className="text-xs text-white/60">
                  Providers: <span className="text-white/80">{meta.providers}</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Google card */}
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Google</div>
                      <div className="text-white/70 text-sm">
                        {meta.hasGoogle ? "Connecté" : "Non connecté"}
                      </div>
                    </div>

                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${
                        meta.hasGoogle
                          ? "border-emerald-400/30 text-emerald-200 bg-emerald-400/10"
                          : "border-white/20 text-white/70 bg-white/5"
                      }`}
                    >
                      {meta.hasGoogle ? "Actif" : "Inactif"}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {!meta.hasGoogle ? (
                      <button
                        onClick={handleLinkGoogle}
                        className="px-4 py-2 rounded-lg bg-linear-to-r from-purple-500 to-indigo-500
                                   hover:opacity-90 text-white text-sm font-semibold transition"
                      >
                        + Ajouter Google
                      </button>
                    ) : (
                      <button
                        onClick={handleUnlinkGoogle}
                        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 active:bg-white/20
                                   border border-white/15 hover:border-white/25 text-white text-sm font-semibold transition"
                      >
                        Retirer Google
                      </button>
                    )}
                  </div>

                  <p className="mt-3 text-xs text-white/60">
                    Clique sur “Ajouter Google” pour lier ton compte via OAuth (redirection backend).
                  </p>
                </div>

                {/* Email/Password card */}
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                  <div className="font-semibold">Email & mot de passe</div>
                  <div className="text-white/70 text-sm mt-1">
                    Gérez votre mot de passe et la vérification email.
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={handleResetPassword}
                      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 active:bg-white/20
                                 border border-white/15 hover:border-white/25 text-white text-sm font-semibold transition"
                    >
                      Changer mot de passe
                    </button>

                    <button
                      onClick={handleVerifyEmail}
                      className="px-4 py-2 rounded-lg bg-linear-to-r from-purple-500 to-indigo-500
                                 hover:opacity-90 text-white text-sm font-semibold transition"
                    >
                      Vérifier email
                    </button>
                  </div>

                  <p className="mt-3 text-xs text-white/60">
                    Une fois l’email vérifié, tu peux renforcer la sécurité et récupérer ton compte plus facilement.
                  </p>
                </div>
              </div>
            </div>

            {/* Editable fields */}
            <div className="rounded-2xl border border-white/15 bg-white/5 p-5 text-white">
              <div className="text-lg font-bold">Modifier le profil</div>
              <div className="text-white/70 text-sm mt-1">
                Actions autorisées (selon ton backend : username non modifiable).
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                  <div className="text-sm text-white/60">Email</div>
                  <div className="font-semibold">{meta.email}</div>
                  <button
                    onClick={handleEditEmail}
                    className="mt-3 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 active:bg-white/20
                               border border-white/15 hover:border-white/25 text-white text-sm font-semibold transition"
                  >
                    Modifier email
                  </button>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                  <div className="text-sm text-white/60">Compte</div>
                  <div className="text-white/80 text-sm mt-1">
                    Username: <span className="font-semibold">{meta.username}</span> (non modifiable)
                  </div>
                  <div className="text-white/80 text-sm mt-1">
                    Statut: <span className="font-semibold">{meta.isActive}</span>
                  </div>

                  {meta.role === "ADMIN" ? (
                    <button
                      onClick={handleToggleActive}
                      className="mt-3 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 active:bg-white/20
                                 border border-white/15 hover:border-white/25 text-white text-sm font-semibold transition"
                    >
                      Activer/Désactiver
                    </button>
                  ) : (
                    <div className="mt-3 text-xs text-white/60">
                      Seul un admin peut activer/désactiver un compte.
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer helper */}
        <div className="mt-6 text-center text-xs text-white/60">
          Astuce: pour lier Google, crée côté backend une route OAuth (ex: <span className="font-mono">/auth/google</span>)
          puis redirige l’utilisateur depuis “Ajouter Google”.
        </div>
      </div>
    </div>
  );
}
