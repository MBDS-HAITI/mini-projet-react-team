import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCourses } from "../../services/course";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Recherche & tri
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const result = await getCourses();
      setCourses(result || []);
    };
    fetchCourses();
  }, []);

  // Filtrage + tri
  const filteredCourses = courses
    .filter(
      (course) =>
        course.name.toLowerCase().includes(search.toLowerCase()) ||
        course.code.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortAsc
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

  return (
    <div className="my-8">
      <div className="w-full max-w-6xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6">

        {/* ===== TITRE ===== */}
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Matières
        </h1>

        {/* ===== BARRE ACTIONS ===== */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">

          {/* Recherche */}
          <input
            type="text"
            placeholder="Rechercher par nom ou code..."
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

          {/* Actions droite */}
          <div className="flex items-center gap-3">

            {/* Tri */}
            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="
                px-4 py-2
                rounded-lg
                bg-white/10
                border border-white/20
                text-white
                hover:bg-white/20
                transition
              "
            >
              Trier {sortAsc ? "↑" : "↓"}
            </button>

            {/* Ajouter */}
            <Link
              to="/courses/add"
              className="
                px-4 py-2
                rounded-lg
                bg-gradient-to-r from-purple-500 to-indigo-500
                text-white
                font-semibold
                hover:opacity-90
                transition
              "
            >
              + Ajouter
            </Link>

          </div>
        </div>

        {/* ===== TABLE ===== */}
        <Paper
          elevation={0}
          sx={{ backgroundColor: "transparent", color: "white" }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {["Nom", "Code", "Actions"].map((head) => (
                    <TableCell
                      key={head}
                      sx={{
                        color: "#cbd5f5",
                        fontWeight: "bold",
                        borderBottom: "1px solid rgba(255,255,255,0.2)",
                      }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredCourses
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((course) => (
                    <TableRow
                      key={course._id}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.05)",
                        },
                      }}
                    >
                      <TableCell sx={{ color: "white" }}>
                        {course.name}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {course.code}
                      </TableCell>

                      {/* Actions (placeholder) */}
                      <TableCell sx={{ color: "#a78bfa" }}>
                        <span className="cursor-pointer hover:underline">
                          Modifier
                        </span>{" "}
                        |{" "}
                        <span className="cursor-pointer hover:underline">
                          Détails
                        </span>{" "}
                        |{" "}
                        <span className="cursor-pointer text-red-400 hover:underline">
                          Supprimer
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* ===== PAGINATION ===== */}
          <TablePagination
            component="div"
            count={filteredCourses.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            sx={{
              color: "white",
              ".MuiTablePagination-selectIcon": { color: "white" },
              ".MuiTablePagination-actions button": { color: "white" },
            }}
          />
        </Paper>
      </div>
    </div>
  );
}
