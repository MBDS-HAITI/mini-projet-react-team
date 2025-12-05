import DisplayGradeRecord from "../components/DisplayGradeRecord";
import data from "../assets/data.json";
import { useEffect, useState } from "react";
import { getGrades } from "../services/grades";

export default function Home() {

  const [grades, setGrades] = useState([]);
      
        useEffect(() => {
          getGrades().then(
                (data) => {
                  setGrades(data)
                }
              )
            .catch((error) => console.error("Error fetching grades:", error));
        }, []);

  return (
    <div className="w-hull">
      <h2 className="w-full flex justify-center text-3xl">HOME</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.length === 0 ? (
          <p>Pas de données disponibles.</p>
        ) : (
          grades.map((gradeRecord,index) => (
            <DisplayGradeRecord
              key={index}
              gradeRecord={gradeRecord}
            />
          ))
        )}
      </div>
    </div>
  );
}
