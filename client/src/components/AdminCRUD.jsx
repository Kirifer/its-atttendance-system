import { useEffect, useState } from "react";
import { getAllUsersWithRoles, changeUserRole } from "../api/auth";
import API from "../api/api";
import "../styles/AdminCRUD.css";
import "../styles/AdminUserModal.css";
import { showToast } from "./Notification/toast";

function AdminCRUD() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("username");

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [saving, setSaving] = useState(false);

  const currentUserId = localStorage.getItem("userId");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsersWithRoles();
      setUsers(data || []);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= ACTIONS ================= */

  const handleResign = async (id, username) => {
    if (!window.confirm(`Resign ${username}?`)) return;
    try {
      await API.put(`/admins/resign/${id}`);
      fetchUsers();
      showToast({ message: `${username} resigned`, type: "success", color: "#fff" });
    } catch (err) {
      showToast({ message: "Failed to resign", type: "error", color: "#fff" });
    }
  };

  const handleReinstate = async (id, username) => {
    if (!window.confirm(`Reinstate ${username}?`)) return;
    try {
      await API.put(`/admins/reinstate/${id}`);
      fetchUsers();
      showToast({ message: `${username} reinstated`, type: "success", color: "#fff" });
    } catch (err) {
      showToast({ message: "Failed to reinstate", type: "error", color: "#fff" });
    }
  };

  const handleChangeRole = async (id, role, username) => {
    if (!window.confirm(`Change ${username}'s role to ${role}?`)) return;
    try {
      await changeUserRole(id, role);
      fetchUsers();
      showToast({ message: "Role updated", type: "success", color: "#fff" });
    } catch {
      showToast({ message: "Failed to change role", type: "error", color: "#fff" });
    }
  };

  /* ================= MODAL ================= */

  const openEditModal = (user) => {
    setSelectedUser({
      ...user,
      department: user.department || "",
      position: user.position || "",
      supervisor: user.supervisor || "",
      manager: user.manager || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleSaveInfo = async () => {
    try {
      setSaving(true);
      await API.put(`/admins/update-user-info/${selectedUser.id}`, {
        department: selectedUser.department,
        position: selectedUser.position,
        supervisor: selectedUser.supervisor,
        manager: selectedUser.manager,
      });
      showToast({ message: "User info updated", type: "success", color: "#fff" });
      closeModal();
      fetchUsers();
    } catch {
      showToast({ message: "Failed to update user", type: "error", color: "#fff" });
    } finally {
      setSaving(false);
    }
  };

  /* ================= FILTER ================= */

  const filteredUsers = users.filter((u) => {
    const value = filterType === "username" ? u.username : u.email;
    return value.toLowerCase().includes(query.toLowerCase());
  });

  if (loading) return <div>Loading users...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <>
      <div className="crud-table-container">
  {/* FIXED SEARCH */}
  <div className="crud-table__search-wrapper">
    <div className="crud-table__search">
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="crud-table__dropdown"
      >
        <option value="username">Username</option>
        <option value="email">Email</option>
      </select>

      <input
        placeholder={`Search by ${filterType}`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="crud-table__input"
      />
    </div>
  </div>
        <div className="crud-table-scroll">
          <table className="crud-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td className={u.resignedAt ? "crud-table__status--rejected" : "crud-table__status--approved"}>
                    {u.resignedAt ? "Resigned" : "Active"}
                  </td>

                  <td className="crud-table__actions">
                    {u.id !== currentUserId && (
                      <>
                        {/* Promote / Demote */}
                        <span
                          className={`material-symbols-outlined crud-action crud-action--role ${
                            u.resignedAt ? "crud-action--disabled" : ""
                          }`}
                          title={u.role === "ADMIN" ? "Demote to User" : "Promote to Admin"}
                          onClick={() =>
                            !u.resignedAt &&
                            handleChangeRole(
                              u.id,
                              u.role === "ADMIN" ? "USER" : "ADMIN",
                              u.username
                            )
                          }
                        >
                          {u.role === "ADMIN" ? "arrow_downward" : "arrow_upward"}
                        </span>

                        {/* Edit Info */}
                        <span
                          className="material-symbols-outlined crud-action crud-action--edit"
                          title="Edit Info"
                          onClick={() => openEditModal(u)}
                        >
                          edit
                        </span>

                        {/* Resign / Reinstate */}
                        {u.resignedAt ? (
                          <span
                            className="material-symbols-outlined crud-action crud-action--reinstate"
                            title="Reinstate"
                            onClick={() => handleReinstate(u.id, u.username)}
                          >
                            restart_alt
                          </span>
                        ) : (
                          <span
                            className="material-symbols-outlined crud-action crud-action--delete"
                            title="Resign"
                            onClick={() => handleResign(u.id, u.username)}
                          >
                            person_remove
                          </span>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <h2>Edit User Info</h2>

            <label>Department</label>
            <input
              value={selectedUser.department}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, department: e.target.value })
              }
            />

            <label>Position</label>
            <input
              value={selectedUser.position}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, position: e.target.value })
              }
            />

            <label>Supervisor</label>
            <input
              value={selectedUser.supervisor}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, supervisor: e.target.value })
              }
            />

            <label>Manager</label>
            <input
              value={selectedUser.manager}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, manager: e.target.value })
              }
            />

            <div className="admin-modal__actions">
              <button onClick={closeModal} disabled={saving}>Cancel</button>
              <button onClick={handleSaveInfo} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminCRUD;
