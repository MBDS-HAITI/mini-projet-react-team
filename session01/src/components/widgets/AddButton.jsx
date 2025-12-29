
export default function AddButton({onAdd}) {
  return (
    <button
      onClick={onAdd}
      className="
                    px-4 py-2
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
