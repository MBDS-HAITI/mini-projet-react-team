import { Link } from "react-router-dom";

export default function MenuItem({ label, link, isActive, mobile = false, onClick }) {
  const base =
    "group relative inline-flex items-center rounded-xl font-medium transition duration-200";

  const desktop =
    "px-3 py-1 text-sm hover:bg-white/10 " +
    (isActive ? "bg-[#280a48] text-white shadow-sm" : "text-white/90");

  const mobileCls =
    "w-full justify-start px-3 py-2 text-[15px] hover:bg-white/10 " +
    (isActive ? "bg-white/10 text-white" : "text-white/90");

  return (
    <li className={mobile ? "w-full" : ""}>
      <Link
        to={link}
        onClick={onClick}
        className={[base, mobile ? mobileCls : desktop].join(" ")}
      >
        <span className="truncate">{label}</span>

        {/* underline animé (desktop uniquement) */}
        {!mobile && (
          <span
            className={[
              "absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 rounded-full transition-all duration-200",
              isActive ? "w-[60%] bg-white" : "w-0 bg-white/70 group-hover:w-8",
            ].join(" ")}
          />
        )}

        {/* indicateur (mobile) */}
        {mobile && isActive && (
          <span className="ml-auto inline-block h-2 w-2 rounded-full bg-white/80" />
        )}
      </Link>
    </li>
  );
}
