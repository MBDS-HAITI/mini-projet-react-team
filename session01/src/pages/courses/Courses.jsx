import { useEffect, useState } from "react";
import { deleteCourse, getCourses } from "../../api/routes/course.api.js";
import SearchInput from "../../components/widgets/SearchInput.jsx";
import SortButton from "../../components/widgets/SortButton.jsx";
import AddButton from "../../components/widgets/AddButton.jsx";
import { StyledTooltip } from "../../components/widgets/StyledTooltip.jsx";
import { IconButton, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, TablePagination } from "@mui/material";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "../../utils/fdate.js";
import UpsertCourseModal from "./UpsertCourse.jsx";


export default function CoursesPage() {
  const [courses, setCourses] = useState([]);

  //upsert modal state
  const [openUpsert, setOpenUpsert] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

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

  const fetchCourses = async () => {
    const result = await getCourses();
    setCourses(result);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Filtrage + tri
  const filteredCourses = courses
    .filter(
      (course) =>
        course.name.toLowerCase().includes(search.toLowerCase()) ||
        course.code.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );

  const onEdit = (row) => {
    setSelectedCourse(row);
    setOpenUpsert(true);
  };

  const onAdd = (row) => {
    setSelectedCourse(null);
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
      await deleteCourse(toDelete._id);
      await fetchCourses();
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
          Liste des cours
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
                    "Code",
                    "Nom",
                    "Crédits",
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
                {filteredCourses
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((course) => (
                    <TableRow
                      key={course._id}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.05)",
                        },
                      }}
                    >
                      <TableCell sx={{ color: "white" }}>
                        {course.code}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {course.name}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {course.credits}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {formatDate(course.createdAt, true)}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {formatDate(course.updatedAt, true)}
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
                              onClick={() => onEdit(course)}
                              sx={{ color: "#a78bfa" }}
                            >
                              <Pencil size={18} />
                            </IconButton>
                          </StyledTooltip>

                          <span style={{ opacity: 0.3 }}>|</span>

                          <StyledTooltip title="Détails" placement="top">
                            <IconButton
                              size="small"
                              onClick={() => onDetails(course)}
                              sx={{ color: "#a78bfa" }}
                            >
                              <Eye size={18} />
                            </IconButton>
                          </StyledTooltip>

                          <span style={{ opacity: 0.3 }}>|</span>

                          <StyledTooltip title="Supprimer" placement="top">
                            <IconButton
                              size="small"
                              onClick={() => askDelete(course)}
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
            count={filteredCourses.length}
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
      {/* Upsert Modal */}
      {openUpsert && (
        <UpsertCourseModal
          open={openUpsert}
          onClose={() => setOpenUpsert(false)}
          mode={selectedCourse ? "edit" : "create"}
          data={selectedCourse}
          onSuccess={fetchCourses}
        />
      )}
    </div>
  );
}
