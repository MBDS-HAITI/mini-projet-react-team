import { useState } from "react";
import MenuItem from "./MenuItem";
import { useLocation } from "react-router-dom";

const menuItems = [
    { label: "Home", link: "/home", tag: "home" },
    { label: "Notes", link: "/grades", tag: "grades" },
    { label: "Etudiants", link: "/students", tag: "students" },
    // { label: "Etudiants2", link: "/students2", tag: "students2" },
    { label: "Matières", link: "/courses", tag: "courses" },
    { label: "A propos", link: "/about", tag: "about" },
];


export default function Menu() {
  const { pathname } = useLocation();
  

  return (
    <div className="w-full bg-[#432866] text-white sticky top-0 z-50">
      <nav className="bg-neutral-secondary-soft border-y border-default border-default">
        <div className="px-4 py-1 mx-auto">
          <div className="flex items-center">
            <ul className="flex flex-row w-full justify-center font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm">
              {menuItems.map((item,index) => (
                <MenuItem key={index} label={item.label} link={item.link} isActive={pathname.includes(item.link)}/>
                ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
