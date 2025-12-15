import React, { use, useEffect, useState } from "react";
import { getAllAdminUsers } from "../api/auth";
import API from "../api/api";
import "../styles/AdminCRUD.css";
import { showToast } from "./Notification/toast";

function AdminCRUD() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("username");

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllAdminUsers();
      setAdmins(data || []);
    } catch (err) {
      console.error("Error fetching admins:", err);
      setError(err.message || "Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Resign admin
  const handleResign = async (id, username) => {
    if (!window.confirm(`Are you sure you want to resign ${username}?`)) return;
    try {
      const token = localStorage.getItem("token");
      await API.put(
        `/admins/resign/${id}`,
        {},
        {
          headers: { Authorization: "Bearer ${token}" },
        }
      );
      fetchAdmins();
      showToast({
        message: `${username} has been resigned successfully!`,
        type: "success",
        color: "#ffffff",
      });
    } catch (err) {
      showToast({
        message:
          err.response?.data?.message ||
          err.message ||
          "Failed to resign admin.",
        type: "error",
        color: "#ffffff",
      });
    }
  };

  // Reinstate admin
  const handleReinstate = async (id, username) => {
    if (!window.confirm(`Are you sure you want to reinstate ${username}?`))
      return;
    try {
      const token = localStorage.getItem("token");
      await API.put(
        `/admins/reinstate/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchAdmins();
      showToast({
        message: `${username} has been reinstated successfully!`,
        type: "success",
        color: "#ffffff",
      });
    } catch (err) {
      showToast({
        message:
          err.response?.data?.message ||
          err.message ||
          "Failed to reinstate admin",
        type: "error",
        color: "#ffffff",
      });
    }
  };

  if (loading) return <div>Loading admin users...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  // search bar function
  const filteredAdmins = admins.filter((a) => {
    const value = filterType === "username" ? a.username : a.email;
    return value.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="crud-table-container">
      {/* search bar */}
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
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {admins.map((a) => (
            <tr key={a.id}>
              <td>{a.username}</td>
              <td>{a.email}</td>
              <td
                className={`crud-table__status ${
                  a.resignedAt
                    ? "crud-table__status--rejected"
                    : "crud-table__status--approved"
                }`}
              >
                {a.resignedAt ? "Resigned" : "Active"}
              </td>
              <td>
                {a.resignedAt === null ? (
                  // Resign admin
                  <button
                    className="crud-table__actions crud-table__reject"
                    onClick={() => handleResign(a.id, a.username)}
                  >
                    Resign
                  </button>
                ) : (
                  // Reinstate admin
                  <button
                    className="crud-table__actions crud-table__approve"
                    onClick={() => handleReinstate(a.id, a.username)}
                  >
                    Reinstate
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
