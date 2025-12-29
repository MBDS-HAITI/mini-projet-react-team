import { useEffect, useState } from "react";

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
import { formatDate } from "../../utils/fdate";
import SortButton from "../../components/widgets/SortButton.jsx";
import SearchInput from "../../components/widgets/SearchInput.jsx";

import UpsertSemesterModal from "./UpsertSemesterModal.jsx";
import SemesterDetailsModal from "./SemesterDetailsModal.jsx";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { StyledTooltip } from "../../components/widgets/StyledTooltip.jsx";
import AddButton from "../../components/widgets/AddButton.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";



export default function SemestersPage() {
  const [semesters, setSemesters] = useState([]);

  //upsert modal state
  const [openUpsert, setOpenUpsert] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(null);

  // Details modal state
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsId, setDetailsId] = useState(null);

  // Delete modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);


  const fetchSemeters = async () => {
    const result = await getSemesters();
    setSemesters(result);
  }

  useEffect(() => {
    fetchSemeters();
  }, []);

  const filteredSemesters = semesters
    .filter(
      (semester) =>
        semester.name.toLowerCase().includes(search.toLowerCase()) ||
        semester.academicYear?.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortAsc ? a?.academicYear?.name.localeCompare(b?.academicYear?.name) : b?.academicYear?.name.localeCompare(a?.academicYear?.name)
    );

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

  return (
    <div className="p-4 md:p-8">
      <div className="w-full max-w-6xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Semestres
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">

          <SearchInput search={search} setSearch={setSearch} setPage={setPage} />


          <div className="flex items-center gap-3">
            <SortButton sortAsc={sortAsc} setSortAsc={setSortAsc} />


            <AddButton onAdd={onAdd} />
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
                    "Année Academique",
                    "Nom",
                    "Date Début",
                    "Date Fin",
                    "Actif",
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
                {filteredSemesters
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((semester) => (
                    <TableRow
                      key={semester._id}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.05)",
                        },
                      }}
                    >
                      <TableCell sx={{ color: "white" }}>
                        {semester.academicYear?.name || "-"}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {semester.name}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {formatDate(semester.startDate)}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {formatDate(semester.endDate)}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {semester.isActive ? "Oui" : "Non"}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {formatDate(semester.createdAt)}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {formatDate(semester.updatedAt)}
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
                              onClick={() => onEdit(semester)}
                              sx={{ color: "#a78bfa" }}
                            >
                              <Pencil size={18} />
                            </IconButton>
                          </StyledTooltip>

                          <span style={{ opacity: 0.3 }}>|</span>

                          <StyledTooltip title="Détails" placement="top">
                            <IconButton
                              size="small"
                              onClick={() => onDetails(semester)}
                              sx={{ color: "#a78bfa" }}
                            >
                              <Eye size={18} />
                            </IconButton>
                          </StyledTooltip>

                          <span style={{ opacity: 0.3 }}>|</span>

                          <StyledTooltip title="Supprimer" placement="top">
                            <IconButton
                              size="small"
                              onClick={() => askDelete(semester)}
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
              color: "white",
              ".MuiTablePagination-selectIcon": { color: "white" },
              ".MuiTablePagination-actions button": { color: "white" },
            }}
          />
        </Paper>


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
              Voulez-vous vraiment supprimer le semestre <b>{toDelete?.name} de {toDelete?.academicYear?.name}</b> ?
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
          semesterId={selectedSemester}
        />
      </div>
    </div>
  );
}
