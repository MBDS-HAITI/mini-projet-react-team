import { Link } from "react-router-dom";


export default function MenuItem({label,link, isActive}) {

  return (
    <li className={`rounded-md py-1 px-2 ${isActive ? " bg-[#280a48] font-semibold" : ""}`}>
      <Link to={link}  className="text-heading hover:underline" aria-current="page">
        {label}
      </Link>
    </li>
  );
}
