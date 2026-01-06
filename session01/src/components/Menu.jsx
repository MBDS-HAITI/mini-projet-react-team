import { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MenuItem from "./MenuItem";
import MyAccount from "./widgets/NavProfile";

const menuItems = [
  { label: "Accueil", link: "/home" },
  { label: "Etudiants", link: "/students" },
  { label: "Inscriptions", link: "/enrollments" },
  { label: "Notes", link: "/grades" },
  { label: "Matières", link: "/courses" },
  { label: "Semestres", link: "/semester" },
  { label: "Années Académiques", link: "/academicyears" },
  { label: "Utilisateurs", link: "/users" },
  { label: "A propos", link: "/about" },
];

export default function Menu() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  // Ferme le menu mobile quand on change de page
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Active link
  const isActive = useMemo(() => {
    return (link) => pathname === link || pathname.startsWith(link + "/");
  }, [pathname]);

  return (
    <header className="w-full sticky top-0 z-50">
      <nav className="bg-[#432866]/95 backdrop-blur border-b border-white/10 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-12 flex items-center justify-between gap-3">
            {/* Left: Burger (mobile) + Desktop menu */}
            <div className="flex items-center gap-1 md:gap-3">
              {/* Burger button (mobile) */}
              <button
                type="button"
                className="md:hidden inline-flex items-center justify-center rounded-xl px-3 py-2
                           text-white/90 hover:bg-white/10 active:bg-white/15 transition"
                aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
              >
                {/* Icon */}
                <span className="relative block w-5 h-4">
                  <span
                    className={[
                      "absolute left-0 top-0 h-0.5 w-5 bg-white/90 rounded transition",
                      open ? "translate-y-[7px] rotate-45" : "",
                    ].join(" ")}
                  />
                  <span
                    className={[
                      "absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-5 bg-white/80 rounded transition",
                      open ? "opacity-0" : "opacity-100",
                    ].join(" ")}
                  />
                  <span
                    className={[
                      "absolute left-0 bottom-0 h-0.5 w-5 bg-white/90 rounded transition",
                      open ? "-translate-y-[7px] -rotate-45" : "",
                    ].join(" ")}
                  />
                </span>
              </button>

              {/* Desktop menu */}
              <ul className="hidden md:flex items-center gap-1 lg:gap-2">
                {menuItems.map((item) => (
                  <MenuItem
                    key={item.link}
                    label={item.label}
                    link={item.link}
                    isActive={isActive(item.link)}
                  />
                ))}
              </ul>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              <MyAccount />
            </div>
          </div>
        </div>

        {/* ===== MOBILE OVERLAY (SOUS LE DRAWER) ===== */}
        {open && (
          <div
            className="md:hidden fixed inset-0 z-40 bg-[black/40]"
            onClick={() => setOpen(false)}
          />
        )}

        {/* ===== MOBILE DRAWER (AU-DESSUS DE L’OVERLAY) ===== */}
        <div className="md:hidden fixed left-0 right-0 top-12 z-50 px-4 pb-4 pointer-events-none">
          <div
            className={[
              "pointer-events-auto", // <= important : permet de cliquer dedans
              "mt-3 rounded-2xl border border-white/10 bg-[#280a48] backdrop-blur shadow-sm",
              "transition-all duration-300 origin-top",
              open ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none",
            ].join(" ")}
          >
            <ul className="flex flex-col p-2">
              {menuItems.map((item) => (
                <MenuItem
                  key={item.link}
                  label={item.label}
                  link={item.link}
                  isActive={isActive(item.link)}
                  mobile
                  onClick={() => setOpen(false)}
                />
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
