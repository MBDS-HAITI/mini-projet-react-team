import { useEffect, useState } from "react";
import { deleteGrade, getGrades, getGradesByStudentId } from "../../api/routes/grade.api.js";
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
import { Pencil, Trash2 } from "lucide-react";
import UpsertGradeModal from "./UpsertGradeModal";
import ConfirmDialog from "../../components/ConfirmDialog";
import Container from "../../components/layout/Container.jsx";
import { ADMIN_ROLE, SCOLARITE_ROLE, STUDENT_ROLE } from "../../utils/roles-type.js";
import { useAuth } from "../../auth/AuthProvider.jsx";

export default function GradesPage() {
  const theme = useTheme(0)
  const { user } = useAuth();
  const canManage = [ADMIN_ROLE, SCOLARITE_ROLE].includes(user.role);

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
    let result;
    if (user.role === STUDENT_ROLE) {
      result = await getGradesByStudentId(user.student._id || user.student);
    } else {
      result = await getGrades();
    }
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

  const title = canManage ? "Liste des Notes" : "Mes Notes";

  const tableHeaders = [
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
        {/* ===== TABLE ===== */}
        <Paper
          elevation={0}
          sx={{ backgroundColor: "transparent"}}
        >
          <TableContainer>
            <Table>
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
                {filteredGrades
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((grade) => (
                    <TableRow
                      key={grade._id}
                      hover
                      sx={{
                          "&:hover": {
                            backgroundColor:
                              theme.palette.table?.rowHover ?? theme.palette.action.hover,
                          },
                        }}
                    >
                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {grade.enrollment?.student?.lastName?.toUpperCase() +
                          " " +
                          grade.enrollment?.student?.firstName || "—"}
                      </TableCell>
                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {grade.enrollment?.student.studentCode}
                      </TableCell>

                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {grade.enrollment?.course?.name}
                      </TableCell>

                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {grade.enrollment?.course?.code}
                      </TableCell>

                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {grade.enrollment?.semester?.name || "—"}
                      </TableCell>
                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {grade.enrollment?.semester?.academicYear?.name || "—"}
                      </TableCell>

                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {grade.value || "—"}
                      </TableCell>

                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {grade.isPublished ? "Oui" : "Non"}
                      </TableCell>
                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {grade.user?.username || "—"}
                      </TableCell>

                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {formatDate(grade.updatedAt)}
                      </TableCell>

                      {canManage && (
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
                      )}
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

      {/* ===== MODALS ===== */}
      {canManage && (
        <div>
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
                pour le cours <b>{toDelete?.enrollment?.course?.name}</b>? de
                l'année académique{" "}
                <b>{toDelete?.enrollment?.semester?.academicYear?.name}</b> ?
              </>
            }
            confirmText="Supprimer"
            onClose={() => !isDeleting && setConfirmOpen(false)}
            onConfirm={confirmDelete}
            loading={isDeleting}
          />
        </div>
      )}
    </>
  );
}
