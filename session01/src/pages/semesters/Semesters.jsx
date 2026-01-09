import { useEffect, useMemo, useState } from "react";
import { getSemesters, deleteSemester } from "../../api/routes/semester.api.js";
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

import UpsertSemesterModal from "./UpsertSemesterModal.jsx";
import SemesterDetailsModal from "./SemesterDetailsModal.jsx";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { StyledTooltip } from "../../components/widgets/StyledTooltip.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import Container from "../../components/layout/Container.jsx";

export default function SemestersPage() {
  const theme = useTheme();

  const [semesters, setSemesters] = useState([]);

  // upsert modal state
  const [openUpsert, setOpenUpsert] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(null);

  // Details modal state
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsId, setDetailsId] = useState(null);

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

  const fetchSemeters = async () => {
    const result = await getSemesters();
    setSemesters(result);
  };

  useEffect(() => {
    fetchSemeters();
  }, []);

  const filteredSemesters = useMemo(() => {
    const q = search.trim().toLowerCase();

    return (semesters ?? [])
      .filter((semester) => {
        if (!q) return true;
        const name = (semester.name ?? "").toLowerCase();
        const year = (semester.academicYear?.name ?? "").toLowerCase();
        return name.includes(q) || year.includes(q);
      })
      .sort((a, b) => {
        const ay = (a?.academicYear?.name ?? "").toLowerCase();
        const by = (b?.academicYear?.name ?? "").toLowerCase();
        return sortAsc ? ay.localeCompare(by) : by.localeCompare(ay);
      });
  }, [semesters, search, sortAsc]);

  const onEdit = (row) => {
    setSelectedSemester(row);
    setOpenUpsert(true);
  };

  const onAdd = () => {
    setSelectedSemester(null);
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
      await deleteSemester(toDelete._id);
      await fetchSemeters();
      setConfirmOpen(false);
      setToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const title = "Liste des Semestres";

  const headers = [
    "Année Académique",
    "Nom",
    "Date Début",
    "Date Fin",
    "Actif",
    "Création",
    "Modification",
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
        <Paper elevation={0} sx={{ backgroundColor: "transparent" }}>
          <TableContainer>
            <Table sx={{ minWidth: 1000 }}>
              <TableHead>
                <TableRow>
                  {headers.map((head) => (
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
                {filteredSemesters
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((semester) => (
                    <TableRow
                      key={semester._id}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor:
                            theme.palette.table?.rowHover ?? theme.palette.action.hover,
                        },
                      }}
                    >
                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {semester.academicYear?.name ?? "—"}
                      </TableCell>

                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {semester.name ?? "—"}
                      </TableCell>

                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {formatDate(semester.startDate)}
                      </TableCell>

                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {formatDate(semester.endDate)}
                      </TableCell>

                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {semester.isActive ? "Oui" : "Non"}
                      </TableCell>

                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {formatDate(semester.createdAt)}
                      </TableCell>

                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {formatDate(semester.updatedAt)}
                      </TableCell>

                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <StyledTooltip title="Modifier" placement="top">
                            <IconButton
                              size="small"
                              onClick={() => onEdit(semester)}
                              sx={{ color: theme.palette.actions?.primary ?? "primary.main" }}
                            >
                              <Pencil size={18} />
                            </IconButton>
                          </StyledTooltip>

                          <span style={{ opacity: 0.35, color: theme.palette.text.disabled }}>|</span>

                          <StyledTooltip title="Détails" placement="top">
                            <IconButton
                              size="small"
                              onClick={() => onDetails(semester)}
                              sx={{ color: theme.palette.actions?.primary ?? "primary.main" }}
                            >
                              <Eye size={18} />
                            </IconButton>
                          </StyledTooltip>

                          <span style={{ opacity: 0.35, color: theme.palette.text.disabled }}>|</span>

                          <StyledTooltip title="Supprimer" placement="top">
                            <IconButton
                              size="small"
                              onClick={() => askDelete(semester)}
                              sx={{ color: theme.palette.actions?.danger ?? "error.main" }}
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

      <UpsertSemesterModal
        open={openUpsert}
        onClose={() => setOpenUpsert(false)}
        mode={selectedSemester ? "edit" : "create"}
        data={selectedSemester}
        onSuccess={fetchSemeters}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Confirmer la suppression"
        message={
          <>
            Voulez-vous vraiment supprimer le semestre{" "}
            <b>
              {toDelete?.name} de {toDelete?.academicYear?.name}
            </b>{" "}
            ?
          </>
        }
        confirmText="Supprimer"
        onClose={() => !isDeleting && setConfirmOpen(false)}
        onConfirm={confirmDelete}
        loading={isDeleting}
      />

      <SemesterDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        semesterId={detailsId}   // ✅ FIX: c'était selectedSemester avant
      />
    </>
  );
}
