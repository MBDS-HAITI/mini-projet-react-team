import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCourses } from "../services/course";

const columns = [
  { field: "id", headerName: "ID", width: 220 },
  { field: "name", headerName: "Course", width: 180 },
  { field: "code", headerName: "Code", width: 80 },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getCourses().then((data) => {
        const formattedData = data.map((course) => ({
          id: course._id,
          name: course.name,
          code: course.code,
        }));
        setCourses(formattedData);
      })
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  return (
    <div className="flex flex-col w-hull">
      <h2 className="w-full flex justify-center text-3xl">Courses List</h2>
      <div className="flex w-full justify-end">
        <Link
          to="/courses/add"
          className="bg-fuchsia-900  hover:bg-fuchsia-950  text-white px-4 py-1 rounded-lg transition-colors mb-2"
        >
          Add Course
        </Link>
      </div>
      <Paper sx={{ maxHeight: "70vh", width: "100%" }}>
        <DataGrid
          rows={courses}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </div>
  );
}
