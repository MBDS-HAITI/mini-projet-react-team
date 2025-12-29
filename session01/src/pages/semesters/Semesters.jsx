import { useEffect, useState } from "react";
import { getSemesters } from "../../api/routes/semester.api.js";
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
import SortButton from "../../components/widgets/SortButton.jsx";
import SearchInput from "../../components/widgets/SearchInput.jsx";

export default function SemestersPage() {

  const [semesters, setSemesters] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  
  useEffect(() => {
    const fetchSemesters = async () => {
      const result = await getSemesters();
      setSemesters(result);
    };

    fetchSemesters();
  }, []);

  const filteredSemesters = semesters
    .filter((semester) =>
      semester.name.toLowerCase().includes(search.toLowerCase())
      || 
      semester.academicYear?.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortAsc
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

  return (
    <div className="p-4 md:p-8 ">
      
      <div className="w-full max-w-6xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6">
        
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Semestres
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        
          {/* Recherche */}
          <SearchInput search={search} setSearch={setSearch} setPage={setPage} />

          {/* Actions droite */}
          <div className="flex items-center gap-3">
            
            <SortButton sortAsc={sortAsc} setSortAsc={setSortAsc} />

            {/* Ajouter */}
            <button
              onClick={() => console.log("Ajouter un semestre")}
              className="
                px-4 py-2
                rounded-lg
                bg-linear-to-r from-purple-500 to-indigo-500
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

        <Paper
          elevation={0}
          sx={{
            backgroundColor: "transparent",
            color: "white",
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    "Année Academique",
                    "Nom",
                    "Date Début",
                    "Date Fin",
                    "Actif",
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
                {filteredSemesters
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((semester) => (
                    <TableRow
                      key={semester._id}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.05)",
                        },
                      }}
                    >
                     
                      <TableCell sx={{ color: "white" }}>
                        {semester.academicYear?.name || "-"}
                      </TableCell>
                      
                      <TableCell sx={{ color: "white" }}>
                        {semester.name}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {formatDate(semester.startDate)}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {formatDate(semester.endDate)}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {semester.isActive ? "Oui" : "Non"}
                      </TableCell>

                       <TableCell sx={{ color: "white" }}>
                        {formatDate(semester.createdAt)}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {formatDate(semester.updatedAt)}
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

          <TablePagination
            component="div"
            count={filteredSemesters.length}
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
