import { useEffect, useState } from "react";
import { getAllStudents } from "../../api/routes/student.api";
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
import { formatDate } from "../../utils/fdate";

export default function StudentsPage() {
  // ===== STATE PRINCIPAL =====
  const [students, setStudents] = useState([]);

  // ===== PAGINATION =====
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // ===== RECHERCHE & TRI =====
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  // ===== ERREUR =====
  const [error, setError] = useState(null);

  // ===== FETCH DATA =====
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const result = await getAllStudents(); 
        setStudents(result);
      } catch (err) {
        setError("Erreur lors du chargement des étudiants");
        console.error(err);
      }
    };

    fetchStudents();
  }, []);

  // ===== FILTRAGE + TRI =====
  const filteredStudents = students
    .filter((student) => {
      const fullName = `${student.firstName || ""} ${student.lastName || ""}`;
      return fullName.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      const nameA = `${a.firstName || ""} ${a.lastName || ""}`;
      const nameB = `${b.firstName || ""} ${b.lastName || ""}`;

      return sortAsc
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

  return (
    /* ===== BACKGROUND GLOBAL ===== */
    <div className="p-8 bg-gradient-to-br from-[#0b0b3b] via-[#1b145c] to-[#050523] flex items-center justify-center px-4">
      {/* ===== CARD ===== */}
      <div className="w-full max-w-5xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6">
        
        {/* ===== TITRE ===== */}
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Liste des étudiants
        </h1>

        {/* ===== BARRE ACTIONS ===== */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          
          {/* Recherche */}
          <input
            type="text"
            placeholder="Rechercher par nom ou prénom..."
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

          {/* Actions */}
          <div className="flex items-center gap-3">
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

            <button
              onClick={() => console.log("Ajouter étudiant")}
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
            </button>
          </div>
        </div>

        {/* ===== ERREUR ===== */}
        {error && (
          <p className="text-red-400 text-center mb-4">{error}</p>
        )}

        {/* ===== TABLE ===== */}
        <Paper
          elevation={0}
          sx={{ backgroundColor: "transparent", color: "white" }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {["Prénom", 
                    "Nom",
                    "Date de naissance",
                    "Sexe",
                    "Phone",
                    "Adresse",
                    "Code de l'étudiant",
                    "Création",
                    "Modification"].map((head) => (
                    <TableCell
                      key={head}
                      sx={{
                        color: "#cbd5f5",
                        fontWeight: "bold",
                        borderBottom:
                          "1px solid rgba(255,255,255,0.2)",
                      }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredStudents
                  .slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                  .map((student) => (
                    <TableRow
                      key={student._id}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor:
                            "rgba(255,255,255,0.05)",
                        },
                      }}
                    >
                      <TableCell sx={{ color: "white" }}>
                        {student.firstName || "—"}
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>
                        {student.lastName || "—"}
                      </TableCell>
                       <TableCell sx={{ color: "white" }}>
                        {formatDate(student.dateOfBith) || "—"}
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>
                        {student.sex || "—"}
                      </TableCell>
                       <TableCell sx={{ color: "white" }}>
                        {student.phone || "—"}
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>
                        {student.address || "—"}
                      </TableCell>
                       <TableCell sx={{ color: "white" }}>
                        {student.studentCode || "—"}
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>
                        {formatDate(student.createdAt) || "—"}
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>
                        {formatDate(student.updatedAt) || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* ===== PAGINATION ===== */}
          <TablePagination
            component="div"
            count={filteredStudents.length}
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
              ".MuiTablePagination-selectIcon": {
                color: "white",
              },
              ".MuiTablePagination-actions button": {
                color: "white",
              },
            }}
          />
        </Paper>
      </div>
    </div>
  );
}
