import React, { useEffect, useState } from "react";
import { getAllUsersWithRoles, changeUserRole } from "../api/auth";
import API from "../api/api";
import "../styles/AdminCRUD.css";
import { showToast } from "./Notification/toast";

function AdminCRUD() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("username");

  const currentUserId = localStorage.getItem("userId"); // optional: to prevent self edits

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllUsersWithRoles();
      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Resign admin
  const handleResign = async (id, username) => {
    if (!window.confirm(`Are you sure you want to resign ${username}?`)) return;
    try {
      const token = localStorage.getItem("token");
      await API.put(`/admins/resign/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
      showToast({ message: `${username} has been resigned!`, type: "success", color: "#fff" });
    } catch (err) {
      showToast({ message: err.response?.data?.message || err.message || "Failed to resign admin.", type: "error", color: "#fff" });
    }
  };

  // Reinstate admin
  const handleReinstate = async (id, username) => {
    if (!window.confirm(`Are you sure you want to reinstate ${username}?`)) return;
    try {
      const token = localStorage.getItem("token");
      await API.put(`/admins/reinstate/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
      showToast({ message: `${username} has been reinstated!`, type: "success", color: "#fff" });
    } catch (err) {
      showToast({ message: err.response?.data?.message || err.message || "Failed to reinstate admin.", type: "error", color: "#fff" });
    }
  };

  // Change role
  const handleChangeRole = async (id, role, username) => {
    if (!window.confirm(`Are you sure you want to change ${username}'s role to ${role}?`)) return;
    try {
      await changeUserRole(id, role);
      fetchUsers();
      showToast({ message: `${username}'s role updated to ${role}`, type: "success", color: "#fff" });
    } catch (err) {
      showToast({ message: err.message || "Failed to change role", type: "error", color: "#fff" });
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  // Search/filter
  const filteredUsers = users.filter(u => {
    const value = filterType === "username" ? u.username : u.email;
    return value.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="crud-table-container">
      {/* Search bar */}
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
          type="text"
          placeholder={`Search by ${filterType}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="crud-table__input"
        />
      </div>

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
          {filteredUsers.map(u => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td className={`crud-table__status ${u.resignedAt ? "crud-table__status--rejected" : "crud-table__status--approved"}`}>
                {u.resignedAt ? "Resigned" : "Active"}
              </td>
              <td>
                {/* Resign/Reinstate buttons only for admins */}
                {u.id !== currentUserId && (
                  u.resignedAt ? (
                    <button
                      className="crud-table__actions crud-table__approve"
                      onClick={() => handleReinstate(u.id, u.username)}
                    >
                      Reinstate
                    </button>
                  ) : (
                    <button
                      className="crud-table__actions crud-table__reject"
                      onClick={() => handleResign(u.id, u.username)}
                    >
                      Resign
                    </button>
                  )
                )}


                {/* Role change button */}
                {u.id !== currentUserId && (
                  <button
                    className="crud-table__actions crud-table__role"
                    onClick={() => handleChangeRole(u.id, u.role === "ADMIN" ? "USER" : "ADMIN", u.username)}
                    disabled={u.resignedAt} // cannot promote resigned
                  >
                    {u.role === "ADMIN" ? "Demote to User" : "Promote to Admin"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminCRUD;
