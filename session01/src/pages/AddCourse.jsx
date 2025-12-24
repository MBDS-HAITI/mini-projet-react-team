import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postCourse } from "../services/course";

export default function AddCoursePage() {
    const navigate = useNavigate();
  const [course, setCourse] = useState({
    name: "",
    code: "",
  });


  function onChange(e) {
    const { id, value } = e.target;
    setCourse((prevCourse) => ({
      ...prevCourse,
      [id]: value,
    }));
  }

  function onSubmit(e) {
    e.preventDefault();
    // Here you would typically handle form submission,
    // e.g., send data to a server or update state in a parent component.
    console.log("Course added:", course);
    postCourse(course).then((data)=>{
      console.log("Response from server:", data);
      navigate("/courses");
    });
  }

  

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Ajouter une Matière</h1>
      <form onSubmit={onSubmit} className="max-w-md mx-auto bg-white/20 p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="name"
          >
            Nom de la Matière
          </label>
          <input
            required
            type="text"
            id="name"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Entrez le nom de la matière"
            onChange={onChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="code"
          >
            Code de la Matière
          </label>
          <input
            required
            type="text"
            id="code"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Entrez le code de la matière"
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
          <Link to={'/courses'} className="bg-blue-900 text-white px-4 py-1 rounded-lg hover:bg-blue-950 transition-colors">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
