import { Link } from "react-router-dom";

export default function MenuItem({ label, link, isActive }) {
  return (
    <li>
      <Link
        to={link}
        className={[
          "relative inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium",
          "transition duration-200",
          "hover:bg-white/10",
          isActive ? "bg-[#280a48] text-white shadow-sm" : "text-white/90",
        ].join(" ")}
      >
        {label}

        {/* underline animé */}
        <span
          className={[
            "absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 rounded-full transition-all duration-200",
            isActive ? "w-[60%] bg-white" : "w-0 bg-white/70 group-hover:w-8",
          ].join(" ")}
        />
      </Link>
    </li>
  );
}
