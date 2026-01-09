import { useEffect, useMemo, useState } from "react";
import { getAllUsers, deleteUser } from "../../api/routes/user.api.js";
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
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import { StyledTooltip } from "../../components/widgets/StyledTooltip.jsx";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "../../utils/fdate";
import UpsertUserModal from "./UpsertUserModal.jsx";
import Container from "../../components/layout/Container.jsx";

const ROLE_LABEL = {
  ADMIN: "Admin",
  SCOLARITE: "Scolarité",
  STUDENT: "Étudiant",
};

export default function UsersPage() {
  const theme = useTheme();

  const [users, setUsers] = useState([]);

  // Modals
  const [openUpsert, setOpenUpsert] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsId, setDetailsId] = useState(null);

  // Delete
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination / Search / Sort
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  const fetchUsers = async () => {
    const result = await getAllUsers();
    setUsers(result || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();

    return (users ?? [])
      .filter((u) => {
        if (!q) return true;

        const haystack = [
          u.email,
          u.username,
          u.role,
          ROLE_LABEL[u.role],
          u.isActive ? "oui" : "non",
          u.mailVerified ? "verifie" : "non verifie",
          u.student?.studentCode,
          u.student?.firstName,
          u.student?.lastName,
          typeof u.student === "string" ? u.student : "",
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(q);
      })
      .sort((a, b) => {
        const aKey = (a.username || a.email || "").toLowerCase();
        const bKey = (b.username || b.email || "").toLowerCase();
        return sortAsc ? aKey.localeCompare(bKey) : bKey.localeCompare(aKey);
      });
  }, [users, search, sortAsc]);

  const onAdd = () => {
    setSelectedUser(null);
    setOpenUpsert(true);
  };

  const onEdit = (row) => {
    setSelectedUser(row);
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
      await deleteUser(toDelete._id);
      await fetchUsers();
      setConfirmOpen(false);
      setToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const title = "Liste des Utilisateurs";

  const headers = [
    "Email",
    "Username",
    "Rôle",
    "Étudiant",
    "Mail vérifié",
    "Actif",
    "Création",
    "Modification",
    "Actions",
  ];

  const renderStudentCell = (u) => {
    if (u.role !== "STUDENT") return "—";

    if (u.student?.studentCode) {
      const fullName = `${u.student.firstName || ""} ${u.student.lastName || ""}`.trim();
      return `${u.student.studentCode} - ${fullName}`.trim();
    }

    if (typeof u.student === "string") return u.student;

    return "—";
  };

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
            <Table sx={{ minWidth: 1100 }}>
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
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((u) => (
                    <TableRow
                      key={u._id}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor:
                            theme.palette.table?.rowHover ?? theme.palette.action.hover,
                        },
                      }}
                    >
                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {u.email ?? "—"}
                      </TableCell>

                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {u.username || "—"}
                      </TableCell>

                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {ROLE_LABEL[u.role] || u.role || "—"}
                      </TableCell>

                      <TableCell sx={{ color: "text.primary" }}>
                        {renderStudentCell(u)}
                      </TableCell>

                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {u.mailVerified ? "Oui" : "Non"}
                      </TableCell>

                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {u.isActive ? "Oui" : "Non"}
                      </TableCell>

                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {formatDate(u.createdAt)}
                      </TableCell>

                      <TableCell sx={{ color: "text.primary", whiteSpace: "nowrap" }}>
                        {formatDate(u.updatedAt)}
                      </TableCell>

                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <StyledTooltip title="Modifier" placement="top">
                            <IconButton
                              size="small"
                              onClick={() => onEdit(u)}
                              sx={{ color: theme.palette.actions?.primary ?? "primary.main" }}
                            >
                              <Pencil size={18} />
                            </IconButton>
                          </StyledTooltip>

                          <span style={{ opacity: 0.35, color: theme.palette.text.disabled }}>|</span>

                          <StyledTooltip title="Détails" placement="top">
                            <IconButton
                              size="small"
                              onClick={() => onDetails(u)}
                              sx={{ color: theme.palette.actions?.primary ?? "primary.main" }}
                            >
                              <Eye size={18} />
                            </IconButton>
                          </StyledTooltip>

                          <span style={{ opacity: 0.35, color: theme.palette.text.disabled }}>|</span>

                          <StyledTooltip title="Supprimer" placement="top">
                            <IconButton
                              size="small"
                              onClick={() => askDelete(u)}
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
            count={filteredUsers.length}
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

      <ConfirmDialog
        open={confirmOpen}
        title="Confirmer la suppression"
        message={
          <>
            Voulez-vous vraiment supprimer l’utilisateur <b>{toDelete?.email}</b> ?
          </>
        }
        confirmText="Supprimer"
        onClose={() => !isDeleting && setConfirmOpen(false)}
        onConfirm={confirmDelete}
        loading={isDeleting}
      />

      <UpsertUserModal
        open={openUpsert}
        onClose={() => setOpenUpsert(false)}
        mode={selectedUser ? "edit" : "create"}
        data={selectedUser}
        onSuccess={fetchUsers}
      />

      {/*
      <UserDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        userId={detailsId}
      />
      */}
    </>
  );
}
