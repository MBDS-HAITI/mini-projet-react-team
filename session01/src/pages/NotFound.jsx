// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold text-white">404</h1>
      <p className="mt-2 text-[#8964b0]">Cette page n’existe pas.</p>

      <div className="mt-6 flex gap-3">
        <Link
          to="/"
          className="rounded-lg bg-white/10 px-4 py-2 text-white hover:bg-white/15"
        >
          Accueil
        </Link>
      </div>
    </div>
  );
}
