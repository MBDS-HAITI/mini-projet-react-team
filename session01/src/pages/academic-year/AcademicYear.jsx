import { useEffect, useMemo, useState } from "react";
import {
  deleteAcademicYear,
  getAcademicYears,
} from "../../api/routes/academic-year.api.js";
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
import { Pencil, Eye, Trash2 } from "lucide-react";
import { formatDate } from "../../utils/fdate";
import { StyledTooltip } from "../../components/widgets/StyledTooltip.jsx";
import UpsertAcademicYearModal from "./UpsertAcademicYearModal";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import AcademicYearDetailsModal from "./AcademiYeardetailsModal.jsx";
import Container from "../../components/layout/Container.jsx";

export default function AcademicYearPage() {
  const theme = useTheme();

  const [academicYears, setAcademicYears] = useState([]);

  // upsert modal state
  const [openUpsert, setOpenUpsert] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);

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

  const fetchAcademicYears = async () => {
    const result = await getAcademicYears();
    setAcademicYears(result);
  };

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  const filteredAcademicYears = useMemo(() => {
    const q = search.trim().toLowerCase();

    return (academicYears ?? [])
      .filter((year) => {
        if (!q) return true;

        const name = (year.name ?? "").toLowerCase();
        const active = year.isActive ? "oui" : "non";
        return name.includes(q) || active.includes(q);
      })
      .sort((a, b) => {
        const aName = (a.name ?? "").toLowerCase();
        const bName = (b.name ?? "").toLowerCase();
        return sortAsc ? aName.localeCompare(bName) : bName.localeCompare(aName);
      });
  }, [academicYears, search, sortAsc]);

  const onEdit = (row) => {
    setSelectedYear(row);
    setOpenUpsert(true);
  };

  const onAdd = () => {
    setSelectedYear(null);
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
      await deleteAcademicYear(toDelete._id);
      await fetchAcademicYears();
      setConfirmOpen(false);
      setToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const title = "Liste des Années Académiques";

  const headers = [
    "Nom",
    "Date Début",
    "Date Fin",
    "Active",
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
                {filteredAcademicYears
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((academicYear) => (
                    <TableRow
                      key={academicYear._id}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor:
                            theme.palette.table?.rowHover ?? theme.palette.action.hover,
                        },
                      }}
                    >
                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {academicYear.name ?? "—"}
                      </TableCell>

                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {formatDate(academicYear.startDate)}
                      </TableCell>

                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {formatDate(academicYear.endDate)}
                      </TableCell>

                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {academicYear.isActive ? "Oui" : "Non"}
                      </TableCell>

                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {formatDate(academicYear.createdAt, true)}
                      </TableCell>

                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {formatDate(academicYear.updatedAt, true)}
                      </TableCell>

                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <StyledTooltip title="Modifier" placement="top">
                            <IconButton
                              size="small"
                              onClick={() => onEdit(academicYear)}
                              sx={{ color: theme.palette.actions?.primary ?? "primary.main" }}
                            >
                              <Pencil size={18} />
                            </IconButton>
                          </StyledTooltip>

                          <span style={{ opacity: 0.35, color: theme.palette.text.disabled }}>|</span>

                          <StyledTooltip title="Détails" placement="top">
                            <IconButton
                              size="small"
                              onClick={() => onDetails(academicYear)}
                              sx={{ color: theme.palette.actions?.primary ?? "primary.main" }}
                            >
                              <Eye size={18} />
                            </IconButton>
                          </StyledTooltip>

                          <span style={{ opacity: 0.35, color: theme.palette.text.disabled }}>|</span>

                          <StyledTooltip title="Supprimer" placement="top">
                            <IconButton
                              size="small"
                              onClick={() => askDelete(academicYear)}
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
            count={filteredAcademicYears.length}
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

      <UpsertAcademicYearModal
        open={openUpsert}
        onClose={() => setOpenUpsert(false)}
        mode={selectedYear ? "edit" : "create"}
        data={selectedYear}
        onSuccess={fetchAcademicYears}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Confirmer la suppression"
        message={
          <>
            Voulez-vous vraiment supprimer l’année <b>{toDelete?.name}</b> ?
          </>
        }
        confirmText="Supprimer"
        onClose={() => !isDeleting && setConfirmOpen(false)}
        onConfirm={confirmDelete}
        loading={isDeleting}
      />

      <AcademicYearDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        academicYearId={detailsId}
      />
    </>
  );
}
