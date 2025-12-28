import { useEffect, useState } from "react";
import { getGrades } from "../../api/routes/grade.api";
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
import SearchInput from "../../components/widgets/SearchInput";

export default function GradesPage() {
  // ===== STATE PRINCIPAL =====
  const [grades, setGrades] = useState([]);

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
    const fetchGrades = async () => {
      try {
        const result = await getGrades();
        setGrades(result);
        console.log(result);
      } catch (err) {
        console.error("Erreur lors du chargement des notes", err);
        setError("Erreur lors du chargement des notes");
      }
    };

    fetchGrades();
  }, []);

  // ===== FILTRAGE + TRI =====
  const filteredGrades = grades
    .filter((grade) =>
      grade.value
        ?.toString()
        .includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortAsc ? a.value - b.value : b.value - a.value
    );

  return (
    /* ===== BACKGROUND GLOBAL ===== */
    <div className="p-4 md:p-8">
      
      {/* ===== CARD CENTRALE ===== */}
      <div className="w-full max-w-6xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6">
        
        {/* ===== TITRE ===== */}
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Notes
        </h1>

        {/* ===== BARRE ACTIONS ===== */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          
          {/* Recherche */}
          <SearchInput placeholder="Recherche code, nom, sexe, adr..." search={search} setSearch={setSearch} setPage={setPage} />
          
          {/* <input
            type="text"
            placeholder="Rechercher par note..."
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
          /> */}

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
              onClick={() => console.log("Ajouter une note")}
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
                  {[
                    "Inscription",
                    "Note",
                    "Date notation",
                    "Noté par",
                    "Création",
                    "Modification",
                    "Actions",
                  ].map((head) => (
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
                {filteredGrades
                  .slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                  .map((grade) => (
                    <TableRow
                      key={grade._id}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.05)",
                        },
                      }}
                    >
                      {/* Enrollment */}
                      <TableCell sx={{ color: "white" }}>
                        {grade.enrollment || "—"}
                      </TableCell>

                      {/* Note */}
                      <TableCell sx={{ color: "white" }}>
                        {grade.value ?? "—"}
                      </TableCell>

                      {/* Date notation */}
                      <TableCell sx={{ color: "white" }}>
                        {formatDate(grade.gradedAt, true)}
                      </TableCell>

                      {/* Noté par */}
                      <TableCell sx={{ color: "white" }}>
                        {grade.gradedByUserId || "—"}
                      </TableCell>

                      {/* Création */}
                      <TableCell sx={{ color: "white" }}>
                        {formatDate(grade.createdAt, true)}
                      </TableCell>

                      {/* Modification */}
                      <TableCell sx={{ color: "white" }}>
                        {formatDate(grade.updatedAt, true)}
                      </TableCell>

                      {/* Actions */}
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
            count={filteredGrades.length}
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
