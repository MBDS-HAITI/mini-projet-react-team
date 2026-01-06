import React from "react";
import SearchInput from "../widgets/SearchInput";
import SortButton from "../widgets/SortButton";
import AddButton from "../widgets/AddButton";

export default function Container({children,title, search, setSearch, sortAsc, setSortAsc, onAdd, setPage}) {
  return (
    <div className="my-2 md:m-4">
      <div className="w-full max-w-sm flex flex-col md:max-w-7xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-2 md:p-6">
        <h1 className="md:text-2xl font-bold text-white p-2 md:mb-6 text-center">
          {title}
        </h1>

        <div className="flex flex-wrap items-center justify-end md:justify-between gap-4 mb-2 md:mb-6">
          <SearchInput
            placeholder="Recherche code, nom, sexe, adr..."
            search={search}
            setSearch={setSearch}
            setPage={setPage}
          />

          <div className="flex items-center gap-3">
            <SortButton sortAsc={sortAsc} setSortAsc={setSortAsc} />
            <AddButton onAdd={onAdd} />
          </div>
        </div>
        {children}
      </div>

    </div>
  );
}
