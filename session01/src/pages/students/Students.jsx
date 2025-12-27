import { useEffect, useMemo, useState } from "react";
import { getAllStudents } from "../../api/routes/student.api.js";
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

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      const result = await getAllStudents();
      setStudents(result);
    };
    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();

    return (students ?? [])
      .filter((s) => {
        const fullName = `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim().toLowerCase();
        const code = (s.studentCode ?? "").toLowerCase();
        const phone = (s.phone ?? "").toLowerCase();
        const sex = (s.sex ?? "").toLowerCase();
        const address = (s.address ?? "").toLowerCase();

        if (!q) return true;

        return (
          fullName.includes(q) ||
          code.includes(q) ||
          phone.includes(q) ||
          sex.includes(q) ||
          address.includes(q)
        );
      })
      .sort((a, b) => {
        // tri par nom, puis prénom
        const aKey = `${a.lastName ?? ""} ${a.firstName ?? ""}`.trim().toLowerCase();
        const bKey = `${b.lastName ?? ""} ${b.firstName ?? ""}`.trim().toLowerCase();
        return sortAsc ? aKey.localeCompare(bKey) : bKey.localeCompare(aKey);
      });
  }, [students, search, sortAsc]);

  return (
    <div className="p-4 md:p-8">
      <div className="w-full max-w-7xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Étudiants
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* Recherche */}
          <SearchInput placeholder="Recherche code, nom, sexe, adr..." search={search} setSearch={setSearch} setPage={setPage} />

          {/* Actions droite */}
          <div className="flex items-center gap-3">
            <SortButton sortAsc={sortAsc} setSortAsc={setSortAsc} />

            <button
              onClick={() => console.log("Ajouter un étudiant")}
              className="
                px-4 py-2 rounded-lg
                bg-linear-to-r from-purple-500 to-indigo-500
                text-white font-semibold
                hover:opacity-90 transition
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
                    "Code",
                    "Nom ",
                    "Sexe",
                    "Date naissance",
                    "Téléphone",
                    "Adresse",
                    "Enregitré Le",
                    // "Modification",
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
                {filteredStudents
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((student) => {
                    const key = student._id || student.id; // chez toi c'est souvent "id"
                    const fullName = `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim();

                    return (
                      <TableRow
                        key={key}
                        hover
                        sx={{
                          "&:hover": { backgroundColor: "rgba(255,255,255,0.05)" },
                        }}
                      >
                        <TableCell sx={{ color: "white" }}>
                          {student.studentCode || "-"}
                        </TableCell>

                        <TableCell sx={{ color: "white" }}>
                          {fullName || "-"}
                        </TableCell>

                        <TableCell sx={{ color: "white" }}>
                          {student.sex || "-"}
                        </TableCell>

                        <TableCell sx={{ color: "white" }}>
                          {formatDate(student.dateOfBirth)}
                        </TableCell>

                        <TableCell sx={{ color: "white" }}>
                          {student.phone || "-"}
                        </TableCell>

                        <TableCell sx={{ color: "white" }}>
                          {student.address || "-"}
                        </TableCell>

                        <TableCell sx={{ color: "white" }}>
                          {formatDate(student.createdAt)}
                        </TableCell>

                        {/* <TableCell sx={{ color: "white" }}>
                          {formatDate(student.updatedAt)}
                        </TableCell> */}

                        <TableCell sx={{ color: "#a78bfa" }}>
                          <span className="cursor-pointer hover:underline">Modifier</span>{" "}
                          |{" "}
                          <span className="cursor-pointer hover:underline">Détails</span>{" "}
                          |{" "}
                          <span className="cursor-pointer text-red-400 hover:underline">
                            Supprimer
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredStudents.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 15, 20]}
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
