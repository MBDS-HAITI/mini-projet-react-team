import { useEffect, useMemo, useState } from "react";
import {
  deleteEnrollment,
  getEnrollments,
  getEnrollmentsByStudentId,
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
import { useTheme } from "@mui/material/styles";
import { formatDate } from "../../utils/fdate";
import { StyledTooltip } from "../../components/widgets/StyledTooltip";
import { Eye, Pencil, Trash2 } from "lucide-react";
import UpsertEnrollmentModal from "./UpsertEnrollmentModal";
import ConfirmDialog from "../../components/ConfirmDialog";
import Container from "../../components/layout/Container";
import { useAuth } from "../../auth/AuthProvider";
import { ADMIN_ROLE, SCOLARITE_ROLE, STUDENT_ROLE } from "../../utils/roles-type";

export default function EnrollmentsPage() {
  const theme = useTheme();
  const { user } = useAuth();
  const canManage = [ADMIN_ROLE, SCOLARITE_ROLE].includes(user.role);

  const [enrollments, setEnrollments] = useState([]);

  // Upsert modal
  const [openUpsert, setOpenUpsert] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  // Details modal state (tu les utilisais déjà)
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsId, setDetailsId] = useState(null);

  // Delete modal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Recherche & tri
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  const fetchEnrollments = async () => {
    let result;

    if (user.role === STUDENT_ROLE) {
      const studentId = user.student?._id ?? user.student;
      result = await getEnrollmentsByStudentId(studentId);
    } else {
      result = await getEnrollments();
    }
    setEnrollments(result);
  };

  useEffect(() => {
    fetchEnrollments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredEnrollments = useMemo(() => {
    const q = search.trim().toLowerCase();

    return (enrollments ?? [])
      .filter((enr) => {
        if (!q) return true;

        const fullName = `${enr.student?.lastName ?? ""} ${enr.student?.firstName ?? ""}`
          .trim()
          .toLowerCase();

        const studentCode = (enr.student?.studentCode ?? "").toLowerCase();
        const courseName = (enr.course?.name ?? "").toLowerCase();
        const courseCode = (enr.course?.code ?? "").toLowerCase();
        const semester = (enr.semester?.name ?? "").toLowerCase();
        const year = (enr.semester?.academicYear?.name ?? "").toLowerCase();
        const status = (enr.status ?? "").toLowerCase();

        return (
          fullName.includes(q) ||
          studentCode.includes(q) ||
          courseName.includes(q) ||
          courseCode.includes(q) ||
          semester.includes(q) ||
          year.includes(q) ||
          status.includes(q)
        );
      })
      .sort((a, b) => {
        const nameA = `${a.student?.lastName ?? ""} ${a.student?.firstName ?? ""}`.trim();
        const nameB = `${b.student?.lastName ?? ""} ${b.student?.firstName ?? ""}`.trim();
        return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      });
  }, [enrollments, search, sortAsc]);

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

  const title = canManage ? "Liste des Enrôlements" : "Mes Enrôlements";

  const tableHeaders = [
    "Étudiant",
    "Code Étudiant",
    "Cours",
    "Code Cours",
    "Semestre",
    "Année Académique",
    "Statut",
    "Création",
    "Modification",
    ...(canManage ? ["Actions"] : []),
  ];

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
        canManage={canManage}
      >
        <Paper elevation={0} sx={{ backgroundColor: "transparent" }}>
          <TableContainer>
            <Table sx={{ minWidth: 1100 }}>
              <TableHead>
                <TableRow>
                  {tableHeaders.map((head) => (
                    <TableCell
                      key={head}
                      sx={{
                        color: theme.palette.table?.headText ?? "text.secondary",
                        fontWeight: 800,
                        borderBottom: "1px solid",
                        borderBottomColor: "divider",
                        whiteSpace: "nowrap",
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
                  .map((enrollment) => {
                    const fullName = `${enrollment.student?.lastName ?? ""} ${enrollment.student?.firstName ?? ""}`
                      .trim();

                    return (
                      <TableRow
                        key={enrollment._id}
                        hover
                        sx={{
                          "&:hover": {
                            backgroundColor:
                              theme.palette.table?.rowHover ?? theme.palette.action.hover,
                          },
                        }}
                      >
                        <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                          {fullName ? fullName.toUpperCase() : "—"}
                        </TableCell>

                        <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                          {enrollment.student?.studentCode ?? "—"}
                        </TableCell>

                        <TableCell sx={{ color: "text.primary" }}>
                          {enrollment.course?.name ?? "—"}
                        </TableCell>

                        <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                          {enrollment.course?.code ?? "—"}
                        </TableCell>

                        <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                          {enrollment.semester?.name ?? "—"}
                        </TableCell>

                        <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                          {enrollment.semester?.academicYear?.name ?? "—"}
                        </TableCell>

                        <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                          {enrollment.status ?? "—"}
                        </TableCell>

                        <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                          {formatDate(enrollment.createdAt)}
                        </TableCell>

                        <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                          {formatDate(enrollment.updatedAt)}
                        </TableCell>

                        {canManage && (
                          <TableCell sx={{ whiteSpace: "nowrap" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <StyledTooltip title="Modifier" placement="top">
                                <IconButton
                                  size="small"
                                  onClick={() => onEdit(enrollment)}
                                  sx={{ color: theme.palette.actions?.primary ?? "primary.main" }}
                                >
                                  <Pencil size={18} />
                                </IconButton>
                              </StyledTooltip>

                              <span style={{ opacity: 0.35, color: theme.palette.text.disabled }}>|</span>

                              <StyledTooltip title="Détails" placement="top">
                                <IconButton
                                  size="small"
                                  onClick={() => onDetails(enrollment)}
                                  sx={{ color: theme.palette.actions?.primary ?? "primary.main" }}
                                >
                                  <Eye size={18} />
                                </IconButton>
                              </StyledTooltip>

                              <span style={{ opacity: 0.35, color: theme.palette.text.disabled }}>|</span>

                              <StyledTooltip title="Supprimer" placement="top">
                                <IconButton
                                  size="small"
                                  onClick={() => askDelete(enrollment)}
                                  sx={{ color: theme.palette.actions?.danger ?? "error.main" }}
                                >
                                  <Trash2 size={18} />
                                </IconButton>
                              </StyledTooltip>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>

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
              color: "text.secondary",
              borderTop: "1px solid",
              borderTopColor: "divider",
              ".MuiTablePagination-selectIcon": { color: "text.secondary" },
              ".MuiTablePagination-actions button": { color: "text.secondary" },
              ".MuiTablePagination-select": { color: "text.secondary" },
              ".MuiTablePagination-displayedRows": { color: "text.secondary" },
            }}
          />
        </Paper>
      </Container>

      {canManage && (
        <>
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
                Voulez-vous vraiment supprimer l’inscription de{" "}
                <b>
                  {toDelete?.student?.lastName?.toUpperCase()} {toDelete?.student?.firstName}
                </b>{" "}
                pour le cours <b>{toDelete?.course?.name}</b> de l’année académique{" "}
                <b>{toDelete?.semester?.academicYear?.name}</b> ?
              </>
            }
            confirmText="Supprimer"
            onClose={() => !isDeleting && setConfirmOpen(false)}
            onConfirm={confirmDelete}
            loading={isDeleting}
          />
        </>
      )}

      {/* <EnrollmentDetailsModal open={detailsOpen} id={detailsId} onClose={() => setDetailsOpen(false)} /> */}
    </>
  );
}
