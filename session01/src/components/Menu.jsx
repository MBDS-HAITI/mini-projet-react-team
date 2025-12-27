
import MenuItem from "./MenuItem";
import { useLocation, useNavigate } from "react-router-dom";
import MyAccount from "./widgets/NavProfile";

const menuItems = [
  { label: "Acceuil", link: "/home" },
  { label: "Etudiants", link: "/students" },
  { label: "Matières", link: "/courses" },
  { label: "Semestres", link: "/semester" },
  { label: "Années Académiques", link: "/academicyear" },
  { label: "Notes", link: "/grades" },
  { label: "A propos", link: "/about" },
];

export default function Menu() {
  const { pathname } = useLocation();

  

  return (
    <header className="w-full sticky top-0 z-50">
      <nav className="bg-[#432866]/95 backdrop-blur border-b border-white/10 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
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
            <MyAccount/>
          </div>
        </div>
      </nav>
    </header>
  );
}
