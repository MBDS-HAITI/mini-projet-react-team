import React from "react";

export default function SortButton({ sortAsc, setSortAsc }) {
  return (
    <button
      onClick={() => setSortAsc(!sortAsc)}
      className="
                px-2 py-1 md:px-4 md:py-2
                rounded-lg
                bg-white/10
                border border-white/20
                text-white
                hover:bg-white/20
                transition
              "
    >
      Trier {sortAsc ? "↑" : "↓"}
    </button>
  );
}
