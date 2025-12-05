import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { getStudents } from "../services/student";
import { Link } from "react-router-dom";

const columns = [
  { field: "id", headerName: "ID", width: 220 },
  { field: "lastName", headerName: "Lastname", width: 130 },
  { field: "firstName", headerName: "Firstname", width: 130 },
];


const paginationModel = { page: 0, pageSize: 10 };

export default function Students() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    getStudents().then(
          (data) => {
            
            const formattedData = data.map((student) => ({
              id: student._id,
              firstName: student.firstName,
              lastName: student.lastName,
            }));
            setStudents(formattedData)
          }
        )
      .catch((error) => console.error("Error fetching students:", error));
  }, []);

  return (
    <div className="flex flex-col w-hull ">
      <h2 className="w-full flex justify-center text-3xl">Students List</h2>
      <div className="flex w-full justify-end">
        <Link
          to="/students/add"
          className="bg-fuchsia-900  hover:bg-fuchsia-950  text-white px-4 py-1 rounded-lg transition-colors mb-2"
        >
          Add Student
        </Link>
      </div>
      <Paper sx={{ maxHeight: "80vh", width: "100%", }}>
        <DataGrid
          rows={students}
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
