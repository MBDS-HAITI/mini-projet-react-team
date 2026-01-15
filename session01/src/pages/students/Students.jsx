import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  TableContainer,
  CircularProgress,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { formatDate } from "../../utils/fdate";
import { StyledTooltip } from "../../components/widgets/StyledTooltip.jsx";
import { Eye, Pencil, Trash2 } from "lucide-react";
import UpsertStudentModal from "./UpsertStudentModal.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import Container from "../../components/layout/Container.jsx";
import { useStudents, useDeleteStudent, STUDENTS_QUERY_KEY } from "../../api/hooks/useStudents.js";
import { useQueryClient } from "@tanstack/react-query";
import Loading from "../../components/common/Loading.jsx";

export default function StudentsPage() {
  const theme = useTheme();
  const queryClient = useQueryClient();

  // React Query hooks
  const { data: students = [], isLoading, error } = useStudents();
  const deleteStudentMutation = useDeleteStudent();

  const [openUpsert, setOpenUpsert] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsId, setDetailsId] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  // Fonction pour rafraîchir manuellement les données
  const refetchStudents = () => {
    queryClient.invalidateQueries({
      queryKey: STUDENTS_QUERY_KEY,
    });
  };

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();

    return (students ?? [])
      .filter((s) => {
        const fullName = `${s.firstName ?? ""} ${s.lastName ?? ""}`
          .trim()
          .toLowerCase();
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
        const aKey = `${a.lastName ?? ""} ${a.firstName ?? ""}`
          .trim()
          .toLowerCase();
        const bKey = `${b.lastName ?? ""} ${b.firstName ?? ""}`
          .trim()
          .toLowerCase();
        return sortAsc ? aKey.localeCompare(bKey) : bKey.localeCompare(aKey);
      });
  }, [students, search, sortAsc]);

  const onEdit = (row) => {
    setSelectedStudent(row);
    setOpenUpsert(true);
  };

  const onAdd = () => {
    setSelectedStudent(null);
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
    try {
      await deleteStudentMutation.mutateAsync(toDelete._id);
      setConfirmOpen(false);
      setToDelete(null);
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
    }
  };

  const title = "Liste des Étudiants";

  const HEADERS = [
    "Code",
    "Nom",
    "Sexe",
    "Date naissance",
    "Téléphone",
    "Adresse",
    "Enregistré le",
    "Compte",
    "Actions",
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
      >
        {/* Affichage du loading */}
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <Loading />
          </Box>
        )}

        {/* Affichage de l'erreur */}
        {error && (
          <Box sx={{ color: "error.main", p: 2 }}>
            Erreur lors du chargement des données: {error.message}
          </Box>
        )}

        {/* Tableau */}
        {!isLoading && !error && (
          <Paper elevation={0} sx={{ backgroundColor: "transparent" }}>
            <TableContainer>
            <Table sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow>
                  {HEADERS.map((head) => (
                    <TableCell
                      key={head}
                      sx={{
                        color: theme.palette.table?.headText ?? theme.palette.text.secondary,
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
                {filteredStudents
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((student) => {
                    const key = student._id || student.id;
                    const fullName = `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim();

                    return (
                      <TableRow
                        key={key}
                        hover
                        sx={{
                          "&:hover": {
                            backgroundColor: theme.palette.table?.rowHover ?? theme.palette.action.hover,
                          },
                        }}
                      >
                        <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                          {student.studentCode || "-"}
                        </TableCell>

                        <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                          {fullName || "-"}
                        </TableCell>

                        <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                          {student.sex || "-"}
                        </TableCell>

                        <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                          {formatDate(student.dateOfBirth)}
                        </TableCell>

                        <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                          {student.phone || "-"}
                        </TableCell>

                        <TableCell sx={{ color: "text.primary", minWidth: 220 }}>
                          {student.address || "-"}
                        </TableCell>

                        <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                          {formatDate(student.createdAt)}
                        </TableCell>

                        <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                          {student.haveAccount ? "Oui" : "Non"}
                        </TableCell>

                        <TableCell sx={{ whiteSpace: "nowrap" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <StyledTooltip title="Modifier">
                              <IconButton
                                size="small"
                                onClick={() => onEdit(student)}
                                sx={{ color: theme.palette.actions?.primary ?? "primary.main" }}
                              >
                                <Pencil size={18} />
                              </IconButton>
                            </StyledTooltip>

                            <StyledTooltip title="Détails">
                              <IconButton
                                size="small"
                                onClick={() => onDetails(student)}
                                sx={{ color: theme.palette.actions?.primary ?? "primary.main" }}
                              >
                                <Eye size={18} />
                              </IconButton>
                            </StyledTooltip>

                            <StyledTooltip title="Supprimer">
                              <IconButton
                                size="small"
                                onClick={() => askDelete(student)}
                                sx={{ color: theme.palette.actions?.danger ?? "error.main" }}
                              >
                                <Trash2 size={18} />
                              </IconButton>
                            </StyledTooltip>
                          </div>
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
        )}
      </Container>

      <UpsertStudentModal
        open={openUpsert}
        onClose={() => setOpenUpsert(false)}
        mode={selectedStudent ? "edit" : "create"}
        data={selectedStudent}
        onSuccess={refetchStudents}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Confirmer la suppression"
        message={
          <>
            Voulez-vous vraiment supprimer l’étudiant{" "}
            <b>
              {toDelete?.firstName} {toDelete?.lastName}
            </b>{" "}
            ?
          </>
        }
        visible={!deleteStudentMutation.isPending}
        onClose={() => !deleteStudentMutation.isPending && setConfirmOpen(false)}
        onConfirm={confirmDelete}
        loading={deleteStudentMutation.isPending}
      />
    </>
  );
}
