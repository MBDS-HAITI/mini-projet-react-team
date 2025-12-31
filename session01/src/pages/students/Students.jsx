import { useEffect, useMemo, useState } from "react";
import { deleteStudent, getAllStudents } from "../../api/routes/student.api.js";
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
import { StyledTooltip } from "../../components/widgets/StyledTooltip.jsx";
import { Eye, Pencil, Trash2 } from "lucide-react";
import AddButton from "../../components/widgets/AddButton.jsx";
import UpsertStudentModal from "./UpsertStudentModal.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);

  //upsert modal state
  const [openUpsert, setOpenUpsert] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

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

  const fetchStudents = async () => {
    const result = await getAllStudents();
    setStudents(result);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

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
        // tri par nom, puis prénom
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

    setIsDeleting(true);
    try {
      await deleteStudent(toDelete._id);
      await fetchStudents();
      setConfirmOpen(false);
      setToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="w-full max-w-7xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Étudiants
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* Recherche */}
          <SearchInput
            placeholder="Recherche code, nom, sexe, adr..."
            search={search}
            setSearch={setSearch}
            setPage={setPage}
          />

          {/* Actions droite */}
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
                    "Code",
                    "Nom ",
                    "Sexe",
                    "Date naissance",
                    "Téléphone",
                    "Adresse",
                    "Enregitré Le",
                    // "Modification",
                    "Compte",
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
                {filteredStudents
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((student) => {
                    const key = student._id || student.id; // chez toi c'est souvent "id"
                    const fullName = `${student.firstName ?? ""} ${
                      student.lastName ?? ""
                    }`.trim();

                    return (
                      <TableRow
                        key={key}
                        hover
                        sx={{
                          "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.05)",
                          },
                        }}
                      >
                        <TableCell sx={{ color: "white" }}>
                          {student.studentCode || "-"}
                        </TableCell>

                        <TableCell sx={{ color: "white" }}>
                          {fullName || "-"}
                        </TableCell>

                        <TableCell sx={{ color: "white" }}>
                          {student.sex || "-"}
                        </TableCell>

                        <TableCell sx={{ color: "white" }}>
                          {formatDate(student.dateOfBirth)}
                        </TableCell>

                        <TableCell sx={{ color: "white" }}>
                          {student.phone || "-"}
                        </TableCell>

                        <TableCell sx={{ color: "white" }}>
                          {student.address || "-"}
                        </TableCell>

                        <TableCell sx={{ color: "white" }}>
                          {formatDate(student.createdAt)}
                        </TableCell>
                        <TableCell sx={{ color: "white" }}>
                          {student.haveAccount ? "Oui" : "Non"}
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
                                onClick={() => onEdit(student)}
                                sx={{ color: "#a78bfa" }}
                              >
                                <Pencil size={18} />
                              </IconButton>
                            </StyledTooltip>

                            <span style={{ opacity: 0.3 }}>|</span>

                            <StyledTooltip title="Détails" placement="top">
                              <IconButton
                                size="small"
                                onClick={() => onDetails(student)}
                                sx={{ color: "#a78bfa" }}
                              >
                                <Eye size={18} />
                              </IconButton>
                            </StyledTooltip>

                            <span style={{ opacity: 0.3 }}>|</span>

                            <StyledTooltip title="Supprimer" placement="top">
                              <IconButton
                                size="small"
                                onClick={() => askDelete(student)}
                                sx={{ color: "#f87171" }} // red-400
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
              color: "white",
              ".MuiTablePagination-selectIcon": { color: "white" },
              ".MuiTablePagination-actions button": { color: "white" },
            }}
          />
        </Paper>
      </div>
      <UpsertStudentModal
        open={openUpsert}
        onClose={() => setOpenUpsert(false)}
        mode={selectedStudent ? "edit" : "create"}
        data={selectedStudent}
        onSuccess={fetchStudents}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Confirmer la suppression"
        message={
          <>
            Voulez-vous vraiment supprimer l’année <b>{toDelete?.firstName} {toDelete?.lastName}</b> ?
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
