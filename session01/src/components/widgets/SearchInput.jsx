
export default function SearchInput({ search, setSearch, setPage , placeholder="Rechercher par nom..."}) {
  return (
    <input
            type="text"
            placeholder={placeholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="
              w-full md:w-72
              px-4 py-2
              rounded-lg
              bg-white/10
              border border-white/20
              text-white
              placeholder:text-gray-300
              focus:outline-none
              focus:ring-2 focus:ring-purple-500
            "
          />
  )
}
