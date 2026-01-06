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
import { StyledTooltip } from "../../components/widgets/StyledTooltip";
import { Eye, Pencil, Trash2 } from "lucide-react";
import UpsertEnrollmentModal from "./UpsertEnrollmentModal";
import ConfirmDialog from "../../components/ConfirmDialog";
import Container from "../../components/layout/Container";

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

  const title = "Liste des Inscriptions";

  return (
    <>
      <Container
        title={title}
        search={search}
        setSearch={setSearch}
        sortAsc={sortAsc}
        setSortAsc={setSortAsc}
        onAdd={onAdd}
        setPage={setPage}
      >
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
      </Container>
      <UpsertEnrollmentModal
        open={openUpsert}
        onClose={() => setOpenUpsert(false)}
        mode={selectedEnrollment ? "edit" : "create"}
        onSuccess={fetchEnrollments}
        data={selectedEnrollment}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Confirmer la suppression"
        message={
          <>
            Voulez-vous vraiment supprimer l’inscrition de de
            <b>
              {" "}
              {toDelete?.student?.lastName?.toUpperCase()}{" "}
              {toDelete?.student?.firstName}{" "}
            </b>
            pour le cours <b>{toDelete?.course?.name}</b>? de l'année académique{" "}
            <b>{toDelete?.semester?.academicYear?.name}</b> ?
          </>
        }
        confirmText="Supprimer"
        onClose={() => !isDeleting && setConfirmOpen(false)}
        onConfirm={confirmDelete}
        loading={isDeleting}
      />
    </>
  );
}
