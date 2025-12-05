import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postStudent } from "../services/student";

export default function AddStudent() {
  const navigate = useNavigate();
  const [student, setStudent] = useState({
    firstName: "",
    lastName: "",
  });


  function onChange(e) {
    const { id, value } = e.target;
    setStudent((prevStudent) => ({
      ...prevStudent,
      [id]: value,
    }));
  }

  function onSubmit(e) {
    e.preventDefault();

    console.log("Student added:", student);

    postStudent(student).then((data)=>{
      console.log("Response from server:", data);
      navigate("/students");
    });
  }

  

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Ajouter une Matière</h1>
      <form onSubmit={onSubmit} className="max-w-md mx-auto bg-white/20 p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="lastName"
          >
            LastName
          </label>
          <input
            required
            type="text"
            id="lastName"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Entrez le lastName de la matière"
            onChange={onChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="firstName"
          >
            Firstname
          </label>
          <input
            required
            type="text"
            id="firstName"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Entrez le nom de la matière"
            onChange={onChange}
          />
        </div>
        <div className="flex w-full gap-2 justify-center">
          <button
            type="submit"
            className="bg-fuchsia-900 text-white px-4 py-1 rounded-lg hover:bg-fuchsia-950 transition-colors"
          >
            Ajouter
          </button>
          <Link to={'/students'} className="bg-blue-900 text-white px-4 py-1 rounded-lg hover:bg-blue-950 transition-colors">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
