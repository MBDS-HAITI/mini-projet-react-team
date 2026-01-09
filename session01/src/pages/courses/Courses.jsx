import { useEffect, useMemo, useState } from "react";
import { deleteCourse, getCourses } from "../../api/routes/course.api.js";
import { StyledTooltip } from "../../components/widgets/StyledTooltip.jsx";
import {
  IconButton,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "../../utils/fdate.js";
import UpsertCourseModal from "./UpsertCourse.jsx";
import Container from "../../components/layout/Container.jsx";

export default function CoursesPage() {
  const theme = useTheme();

  const [courses, setCourses] = useState([]);

  // Upsert modal state
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

  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase();

    return (courses ?? [])
      .filter((course) => {
        if (!q) return true;
        const name = (course.name ?? "").toLowerCase();
        const code = (course.code ?? "").toLowerCase();
        const credits = String(course.credits ?? "").toLowerCase();
        return name.includes(q) || code.includes(q) || credits.includes(q);
      })
      .sort((a, b) => {
        const aName = (a.name ?? "").toLowerCase();
        const bName = (b.name ?? "").toLowerCase();
        return sortAsc ? aName.localeCompare(bName) : bName.localeCompare(aName);
      });
  }, [courses, search, sortAsc]);

  const onEdit = (row) => {
    setSelectedCourse(row);
    setOpenUpsert(true);
  };

  const onAdd = () => {
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

  const title = "Liste des cours";

  const headers = ["Code", "Nom", "Crédits", "Création", "Modification", "Actions"];

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
            <Table sx={{ minWidth: 900 }}>
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
                {filteredCourses
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((course) => (
                    <TableRow
                      key={course._id}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor:
                            theme.palette.table?.rowHover ?? theme.palette.action.hover,
                        },
                      }}
                    >
                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {course.code ?? "—"}
                      </TableCell>

                      <TableCell sx={{ color: "text.primary" }}>
                        {course.name ?? "—"}
                      </TableCell>

                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {course.credits ?? "—"}
                      </TableCell>

                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {formatDate(course.createdAt, true)}
                      </TableCell>

                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {formatDate(course.updatedAt, true)}
                      </TableCell>

                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <StyledTooltip title="Modifier" placement="top">
                            <IconButton
                              size="small"
                              onClick={() => onEdit(course)}
                              sx={{ color: theme.palette.actions?.primary ?? "primary.main" }}
                            >
                              <Pencil size={18} />
                            </IconButton>
                          </StyledTooltip>

                          <span style={{ opacity: 0.35, color: theme.palette.text.disabled }}>|</span>

                          <StyledTooltip title="Détails" placement="top">
                            <IconButton
                              size="small"
                              onClick={() => onDetails(course)}
                              sx={{ color: theme.palette.actions?.primary ?? "primary.main" }}
                            >
                              <Eye size={18} />
                            </IconButton>
                          </StyledTooltip>

                          <span style={{ opacity: 0.35, color: theme.palette.text.disabled }}>|</span>

                          <StyledTooltip title="Supprimer" placement="top">
                            <IconButton
                              size="small"
                              onClick={() => askDelete(course)}
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

      {openUpsert && (
        <UpsertCourseModal
          open={openUpsert}
          onClose={() => setOpenUpsert(false)}
          mode={selectedCourse ? "edit" : "create"}
          data={selectedCourse}
          onSuccess={fetchCourses}
        />
      )}
    </>
  );
}
