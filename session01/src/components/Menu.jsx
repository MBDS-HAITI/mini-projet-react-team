import { useAuth } from "../auth/AuthProvider";
import MenuItem from "./MenuItem";
import { useLocation, useNavigate } from "react-router-dom";

const menuItems = [
  { label: "Home", link: "/home" },
  { label: "Notes", link: "/grades" },
  { label: "Etudiants", link: "/students" },
  { label: "Matières", link: "/courses" },
  { label: "A propos", link: "/about" },
];

export default function Menu() {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  

  return (
    <header className="w-full sticky top-0 z-50">
      <nav className="bg-[#432866]/95 backdrop-blur border-b border-white/10 shadow-md">
        <div className="max-w-5xl mx-auto px-4">
          <div className="h-12 flex items-center justify-between">
            {/* Left: Menu items */}
            <ul className="flex items-center gap-2 sm:gap-3">
              {menuItems.map((item, index) => (
                <MenuItem
                  key={index}
                  label={item.label}
                  link={item.link}
                  isActive={pathname === item.link || pathname.startsWith(item.link + "/")}
                />
              ))}
            </ul>

            {/* Right: Logout */}
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium
                         bg-white/10 hover:bg-white/15 active:bg-white/20
                         border border-white/15 hover:border-white/25
                         transition"
              title="Se déconnecter"
            >
              <span className="text-lg leading-none">⏻</span>
              Déconnexion
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
