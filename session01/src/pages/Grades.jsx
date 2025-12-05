import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { getGrades } from "../services/grades";

const columns = [
  { field: "id", headerName: "ID", width: 220 },
  { field: "lastName", headerName: "Last name", width: 130 },
  { field: "firstName", headerName: "First name", width: 130 },
  { field: "course", headerName: "Course", width: 130 },
  { field: "grade", headerName: "Grade", width: 90 },
  { field: "date", headerName: "Date", width: 120 },
];

const paginationModel = { page: 0, pageSize: 10 };

export default function Notes() {
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    getGrades()
      .then((data) => {
        const formattedData = data.map((grade, index) => ({
          id: grade._id,
          lastName: grade.student.lastName,
          firstName: grade.student.firstName,
          course: grade.course.name,
          grade: grade.grade,
          date: new Date(grade.date).toLocaleDateString(),
        }));
        setGrades(formattedData);
      })
      .catch((error) => console.error("Error fetching grades:", error));
  }, []);

  return (
    <div className="flex flex-col w-hull">
      <h2 className="w-full flex justify-center text-3xl">Grades List</h2>
      <Paper sx={{ width: "100%", maxHeight: "80vh" }}>
        <DataGrid
          rows={grades}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10, 15]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </div>
  );
}
