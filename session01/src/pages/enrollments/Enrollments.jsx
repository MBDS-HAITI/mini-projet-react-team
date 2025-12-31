import { useEffect, useState } from "react";
import {
  deleteEnrollment,
  getEnrollments,
} from "../../api/routes/enrollment.api";
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
import UpsertEnrollmentModal from "./UpsertEnrollmentModal";

export default function EnrollmentsPage() {
  // ===== STATE PRINCIPAL =====
  const [enrollments, setEnrollments] = useState([]);

  //upsert modal state
  const [openUpsert, setOpenUpsert] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

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
  const fetchEnrollments = async () => {
    const result = await getEnrollments();
    console.log({result});
    
    setEnrollments(result);
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  // ===== FILTRAGE + TRI =====
  const filteredEnrollments = enrollments
    .filter((enrollment) => {
      const studentName =
        enrollment.student?.name || enrollment.student?.firstName || "";
      return studentName.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      const nameA = a.student?.name || "";
      const nameB = b.student?.name || "";
      return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

  const onEdit = (row) => {
    setSelectedEnrollment(row);
    setOpenUpsert(true);
  };

  const onAdd = () => {
    setSelectedEnrollment(null);
    setOpenUpsert(true);
  };

  const onDetails = (row) => {
    setDetailsId(row._id);
    setDetailsOpen(true);
  };

  const askDelete = (row) => {
    setToDelete(row);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!toDelete?._id) return;

    setIsDeleting(true);
    try {
      await deleteEnrollment(toDelete._id);
      await fetchEnrollments();
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
          Liste des Inscriptions
        </h1>

        {/* ===== BARRE ACTIONS ===== */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* Recherche */}
          <SearchInput
            search={search}
            setSearch={setSearch}
            setPage={setPage}
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
                        borderBottom: "1px solid rgba(255,255,255,0.2)",
                      }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredEnrollments
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((enrollment) => (
                    <TableRow
                      key={enrollment._id}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.05)",
                        },
                      }}
                    >
                      <TableCell sx={{ color: "white" }}>
                        {enrollment.student?.lastName?.toUpperCase() +
                          " " +
                          enrollment.student?.firstName || "—"}
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>
                        {enrollment.student.studentCode}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {enrollment.course?.name}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {enrollment.course?.code}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {enrollment.semester?.name || "—"}
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>
                        {enrollment.semester?.academicYear?.name || "—"}
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
                              onClick={() => onEdit(enrollment)}
                              sx={{ color: "#a78bfa" }}
                            >
                              <Pencil size={18} />
                            </IconButton>
                          </StyledTooltip>

                          <span style={{ opacity: 0.3 }}>|</span>

                          <StyledTooltip title="Détails" placement="top">
                            <IconButton
                              size="small"
                              onClick={() => onDetails(enrollment)}
                              sx={{ color: "#a78bfa" }}
                            >
                              <Eye size={18} />
                            </IconButton>
                          </StyledTooltip>

                          <span style={{ opacity: 0.3 }}>|</span>

                          <StyledTooltip title="Supprimer" placement="top">
                            <IconButton
                              size="small"
                              onClick={() => askDelete(enrollment)}
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
      <UpsertEnrollmentModal
        open={openUpsert}
        onClose={() => setOpenUpsert(false)}
        mode={ selectedEnrollment ? "edit" : "create"}
        onSuccess={fetchEnrollments}
        data={selectedEnrollment}
      />
    </div>
  );
}
