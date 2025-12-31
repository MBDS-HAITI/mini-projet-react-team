import { useEffect, useState } from "react";
import { deleteGrade, getGrades } from "../../api/routes/grade.api.js";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
} from "@mui/material";
import { formatDate } from "../../utils/fdate";
import SearchInput from "../../components/widgets/SearchInput";
import SortButton from "../../components/widgets/SortButton";
import AddButton from "../../components/widgets/AddButton";
import { StyledTooltip } from "../../components/widgets/StyledTooltip";
import { Eye, Pencil, Trash2 } from "lucide-react";
import UpsertGradeModal from "./UpsertGradeModal";
import ConfirmDialog from "../../components/ConfirmDialog";

export default function GradesPage() {
  // ===== STATE PRINCIPAL =====
  const [grades, setGrades] = useState([]);

  //upsert modal state
  const [openUpsert, setOpenUpsert] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);

  // Delete modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Recherche & tri
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  // ===== FETCH DATA =====
  const fetchGrades = async () => {
    const result = await getGrades();
    setGrades(result);
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  // ===== FILTRAGE + TRI =====
  const q = search.toLowerCase();
  const filteredGrades = grades
    .filter(
      (grade) =>
        grade.enrollment?.student?.lastName?.toLowerCase().includes(q) ||
        grade.enrollment?.student?.firstName?.toLowerCase().includes(q) ||
        grade.enrollment?.student?.studentCode?.toLowerCase().includes(q) ||
        grade.enrollment?.course?.name?.toLowerCase().includes(q) ||
        grade.enrollment?.course?.code?.toLowerCase().includes(q) ||
        grade.enrollment?.semester?.name?.toLowerCase().includes(q) ||
        grade.enrollment?.semester?.academicYear?.name
          ?.toLowerCase()
          .includes(q)
    )
    .sort((a, b) => {
      const nameA =
        a.enrollment?.student?.lastName ||
        a.enrollment?.student?.firstName ||
        "";
      const nameB =
        b.enrollment?.student?.lastName ||
        b.enrollment?.student?.firstName ||
        "";
      return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

  const onEdit = (row) => {
    setSelectedGrade(row);
    setOpenUpsert(true);
  };

  const onAdd = () => {
    setSelectedGrade(null);
    setOpenUpsert(true);
  };



  const askDelete = (row) => {
    setToDelete(row);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!toDelete?._id) return;

    setIsDeleting(true);
    try {
      await deleteGrade(toDelete._id);
      await fetchGrades();
      setConfirmOpen(false);
      setToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    /* ===== BACKGROUND GLOBAL ===== */
    <div className="p-4 md:p-8">
      {/* ===== CARD CENTRALE ===== */}
      <div className="w-full max-w-7xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6">
        {/* ===== TITRE ===== */}
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Liste des Notes
        </h1>

        {/* ===== BARRE ACTIONS ===== */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* Recherche */}
          <SearchInput
            search={search}
            setSearch={setSearch}
            setPage={setPage}
            placeholder="nom, prenom, matière..."
          />

          {/* Actions droite */}
          <div className="flex items-center gap-3">
            {/* Tri */}
            <SortButton sortAsc={sortAsc} setSortAsc={setSortAsc} />

            {/* Ajouter */}
            <AddButton onAdd={onAdd} />
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
                    "Code Étudiant",
                    "Cours",
                    "Code Cours",
                    "Semestre",
                    "Année Académique",
                    "Note",
                    "Publiée",
                    "Enregistré par",
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
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                      <TableCell sx={{ color: "white" }}>
                        {grade.enrollment?.student?.lastName?.toUpperCase() +
                          " " +
                          grade.enrollment?.student?.firstName || "—"}
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>
                        {grade.enrollment?.student.studentCode}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {grade.enrollment?.course?.name}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {grade.enrollment?.course?.code}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {grade.enrollment?.semester?.name || "—"}
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>
                        {grade.enrollment?.semester?.academicYear?.name || "—"}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {grade.value || "—"}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {grade.isPublished ? "Oui" : "Non"}
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>
                        {grade.user?.username || "—"}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {formatDate(grade.updatedAt)}
                      </TableCell>

                      <TableCell sx={{ color: "#a78bfa" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <StyledTooltip title="Modifier" placement="top">
                            <IconButton
                              size="small"
                              onClick={() => onEdit(grade)}
                              sx={{ color: "#a78bfa" }}
                            >
                              <Pencil size={18} />
                            </IconButton>
                          </StyledTooltip>

                          <span style={{ opacity: 0.3 }}>|</span>

                          <StyledTooltip title="Supprimer" placement="top">
                            <IconButton
                              size="small"
                              onClick={() => askDelete(grade)}
                              sx={{ color: "#f87171" }}
                            >
                              <Trash2 size={18} />
                            </IconButton>
                          </StyledTooltip>
                        </div>
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
      <UpsertGradeModal
        open={openUpsert}
        onClose={() => setOpenUpsert(false)}
        mode={selectedGrade ? "edit" : "create"}
        onSuccess={fetchGrades}
        data={selectedGrade}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Confirmer la suppression"
        message={
          <>
            Voulez-vous vraiment supprimer la note
            <b>
              {" "}
              {toDelete?.enrollment?.student?.lastName?.toUpperCase()}{" "}
              {toDelete?.enrollment?.student?.firstName}{" "}
            </b>
            pour le cours <b>{toDelete?.enrollment?.course?.name}</b>? de l'année académique{" "}
            <b>{toDelete?.enrollment?.semester?.academicYear?.name}</b> ?
          </>
        }
        confirmText="Supprimer"
        onClose={() => !isDeleting && setConfirmOpen(false)}
        onConfirm={confirmDelete}
        loading={isDeleting}
      />
    </div>
  );
}
