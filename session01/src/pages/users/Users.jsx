import { useEffect, useState } from "react";

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

import SortButton from "../../components/widgets/SortButton.jsx";
import SearchInput from "../../components/widgets/SearchInput.jsx";
import AddButton from "../../components/widgets/AddButton.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import { StyledTooltip } from "../../components/widgets/StyledTooltip.jsx";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { formatDate } from "../../utils/fdate";
import UpsertUserModal from "./UpsertUserModal.jsx";

// TODO (optionnel): à créer si tu veux edit/details
// import UpsertUserModal from "./UpsertUserModal.jsx";
// import UserDetailsModal from "./UserDetailsModal.jsx";

const ROLE_LABEL = {
  ADMIN: "Admin",
  SCOLARITE: "Scolarité",
  STUDENT: "Étudiant",
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  // Modals (optionnels)
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

  const q = search.trim().toLowerCase();

  const filteredUsers = users
    .filter((u) => {
      if (!q) return true;

      const haystack = [
        u.email,
        u.username,
        u.role,
        ROLE_LABEL[u.role],
        u.isActive ? "oui" : "non",
        u.mailVerified ? "verifie" : "non verifie",
        // si user.student est populaté:
        u.student?.studentCode,
        u.student?.firstName,
        u.student?.lastName,
        // sinon ça sera juste un id:
        typeof u.student === "string" ? u.student : "",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    })
    .sort((a, b) => {
      // tri par username sinon email
      const aKey = (a.username || a.email || "").toLowerCase();
      const bKey = (b.username || b.email || "").toLowerCase();
      return sortAsc ? aKey.localeCompare(bKey) : bKey.localeCompare(aKey);
    });

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

  return (
    <div className="p-4 md:p-8">
      <div className="w-full max-w-7xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Utilisateurs
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <SearchInput
            search={search}
            setSearch={setSearch}
            setPage={setPage}
            placeholder="email, username, student"
          />

          <div className="flex items-center gap-3">
            <SortButton sortAsc={sortAsc} setSortAsc={setSortAsc} />
            <AddButton onAdd={onAdd} />
          </div>
        </div>

        <Paper
          elevation={0}
          sx={{ backgroundColor: "transparent", color: "white" }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    "Email",
                    "Username",
                    "Rôle",
                    "Étudiant",
                    "Mail vérifié",
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
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((u) => (
                    <TableRow
                      key={u._id}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.05)",
                        },
                      }}
                    >
                      <TableCell sx={{ color: "white" }}>{u.email}</TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {u.username || "-"}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {ROLE_LABEL[u.role] || u.role}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {u.role === "STUDENT"
                          ? u.student?.studentCode
                            ? `${u.student.studentCode} - ${
                                u.student.firstName || ""
                              } ${u.student.lastName || ""}`.trim()
                            : typeof u.student === "string"
                            ? u.student
                            : "-"
                          : "-"}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {u.mailVerified ? "Oui" : "Non"}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {u.isActive ? "Oui" : "Non"}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {formatDate(u.createdAt)}
                      </TableCell>

                      <TableCell sx={{ color: "white" }}>
                        {formatDate(u.updatedAt)}
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
                              onClick={() => onEdit(u)}
                              sx={{ color: "#a78bfa" }}
                            >
                              <Pencil size={18} />
                            </IconButton>
                          </StyledTooltip>

                          <span style={{ opacity: 0.3 }}>|</span>

                          <StyledTooltip title="Détails" placement="top">
                            <IconButton
                              size="small"
                              onClick={() => onDetails(u)}
                              sx={{ color: "#a78bfa" }}
                            >
                              <Eye size={18} />
                            </IconButton>
                          </StyledTooltip>

                          <span style={{ opacity: 0.3 }}>|</span>

                          <StyledTooltip title="Supprimer" placement="top">
                            <IconButton
                              size="small"
                              onClick={() => askDelete(u)}
                              sx={{ color: "#f87171" }}
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
              color: "white",
              ".MuiTablePagination-selectIcon": { color: "white" },
              ".MuiTablePagination-actions button": { color: "white" },
            }}
          />
        </Paper>

        <ConfirmDialog
          open={confirmOpen}
          title="Confirmer la suppression"
          message={
            <>
              Voulez-vous vraiment supprimer l’utilisateur{" "}
              <b>{toDelete?.email}</b> ?
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
      </div>
    </div>
  );
}
