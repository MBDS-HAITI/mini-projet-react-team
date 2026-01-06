
export default function AddButton({onAdd}) {
  return (
    <button
      onClick={onAdd}
      className="
                    px-2 py-1 md:px-4 md:py-2
                    rounded-lg
                    bg-linear-to-r from-purple-500 to-indigo-500
                    text-white
                    font-semibold
                    hover:opacity-90
                    transition
                  "
    >
      + Ajouter
    </button>
  );
}
