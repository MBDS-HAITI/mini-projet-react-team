import { useEffect, useState } from "react";
import { getEnrollments } from "../../api/routes/enrollment.api";
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

export default function EnrollmentsPage() {
  // ===== STATE PRINCIPAL =====
  const [enrollments, setEnrollments] = useState([]);

  // ===== PAGINATION =====
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // ===== RECHERCHE & TRI =====
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  // ===== FETCH DATA =====
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const result = await getEnrollments();
        setEnrollments(result);
        console.log(result);
      } catch (error) {
        console.error("Erreur lors du chargement des inscriptions", error);
      }
    };

    fetchEnrollments();
  }, []);

  // ===== FILTRAGE + TRI =====
  const filteredEnrollments = enrollments
    .filter((enrollment) => {
      const studentName =
        enrollment.student?.name ||
        enrollment.student?.firstName ||
        "";
      return studentName.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      const nameA = a.student?.name || "";
      const nameB = b.student?.name || "";
      return sortAsc
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

  return (
    /* ===== BACKGROUND GLOBAL ===== */
    <div className="p-8 bg-gradient-to-br from-[#0b0b3b] via-[#1b145c] to-[#050523] flex items-center justify-center px-4">
      {/* ===== CARD CENTRALE ===== */}
      <div className="w-full max-w-6xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6">
        {/* ===== TITRE ===== */}
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Inscriptions
        </h1>

        {/* ===== BARRE ACTIONS ===== */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* Recherche */}
          <input
            type="text"
            placeholder="Rechercher par étudiant..."
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
              onClick={() => console.log("Nouvelle inscription")}
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
              + S’inscrire
            </button>
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
                  {[
                    "Étudiant",
                    "Cours",
                    "Semestre",
                    "Statut",
                    "Création",
                    "Modification",
                    "Actions",
                  ].map((head) => (
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
                {filteredEnrollments
                  .slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                  .map((enrollment) => (
                    <TableRow
                      key={enrollment._id}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor:
                            "rgba(255,255,255,0.05)",
                        },
                      }}
                    >
                      <TableCell sx={{ color: "white" }}>
                        {enrollment.student?.name ||
                          enrollment.student?.firstName ||
                          "—"}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {enrollment.course?.name || "—"}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {enrollment.semester?.name || "—"}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {enrollment.status || "—"}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {formatDate(enrollment.createdAt)}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {formatDate(enrollment.updatedAt)}
                      </TableCell>

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
            count={filteredEnrollments.length}
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
