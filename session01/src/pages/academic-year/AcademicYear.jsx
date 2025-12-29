import { useEffect, useState } from "react";
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
import { Pencil, Eye, Trash2, Plus } from "lucide-react";
import { formatDate } from "../../utils/fdate";
import SortButton from "../../components/widgets/SortButton.jsx";
import SearchInput from "../../components/widgets/SearchInput.jsx";
import { StyledTooltip } from "../../components/widgets/StyledTooltip.jsx";
import UpsertAcademicYearModal from "./UpsertAcademicYearModal";
import AddButton from "../../components/widgets/AddButton.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import AcademicYearDetailsModal from "./AcademiYeardetailsModal.jsx";

export default function AcademicYearPage() {
  const [academicYears, setAcademicYears] = useState([]);

  //upsert modal state
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

  const fetchAcademicYear = async () => {
    const result = await getAcademicYears();
    setAcademicYears(result);
  };

  useEffect(() => {
    fetchAcademicYear();
  }, []);

  // Filtrage + tri
  const filteredAcademicYears = academicYears
    .filter((year) => year.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );

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
      await fetchAcademicYear();
      setConfirmOpen(false);
      setToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="my-8">
      <div className="w-full max-w-6xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Années académiques
        </h1>

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
                    "Nom",
                    "Date Début",
                    "Date Fin",
                    "Active",
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
                {filteredAcademicYears
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((academicYear) => (
                    <TableRow
                      key={academicYear._id}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.05)",
                        },
                      }}
                    >
                      <TableCell sx={{ color: "white" }}>
                        {academicYear.name}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {formatDate(academicYear.startDate)}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {formatDate(academicYear.endDate)}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {academicYear.isActive ? "Oui" : "Non"}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {formatDate(academicYear.createdAt, true)}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {formatDate(academicYear.updatedAt, true)}
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
                              onClick={() => onEdit(academicYear)}
                              sx={{ color: "#a78bfa" }}
                            >
                              <Pencil size={18} />
                            </IconButton>
                          </StyledTooltip>

                          <span style={{ opacity: 0.3 }}>|</span>

                          <StyledTooltip title="Détails" placement="top">
                            <IconButton
                              size="small"
                              onClick={() => onDetails(academicYear)}
                              sx={{ color: "#a78bfa" }}
                            >
                              <Eye size={18} />
                            </IconButton>
                          </StyledTooltip>

                          <span style={{ opacity: 0.3 }}>|</span>

                          <StyledTooltip title="Supprimer" placement="top">
                            <IconButton
                              size="small"
                              onClick={() => askDelete(academicYear)}
                              sx={{ color: "#f87171" }} // red-400
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
              color: "white",
              ".MuiTablePagination-selectIcon": { color: "white" },
              ".MuiTablePagination-actions button": { color: "white" },
            }}
          />
        </Paper>
      </div>
      {/* Modal Section */}
      <UpsertAcademicYearModal
        open={openUpsert}
        onClose={() => setOpenUpsert(false)}
        mode={selectedYear ? "edit" : "create"}
        data={selectedYear}
        onSuccess={fetchAcademicYear}
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
    </div>
  );
}
