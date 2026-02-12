import { useEffect, useState, useCallback } from "react";
import Loader from "./Spinner/Loader";
import API from "../api/api";
import { showToast } from "./Notification/toast";
import "../styles/Approvals.css";
import "../styles/AdminCRUD.css"; // reuse table styling

function ArchiveList() {
  const [loading, setLoading] = useState(true);
  const [archives, setArchives] = useState([]);

  /* ================= FETCH ARCHIVED USERS ================= */

  const fetchArchives = useCallback(async () => {
    try {
      setLoading(true);

      // ✅ MUST match backend route
      const res = await API.get("/auth/all-users");

      // safety fallback
      const users = Array.isArray(res?.data?.users)
        ? res.data.users
        : [];

      // ✅ filter archived users only
      const archivedUsers = users.filter((u) => u.isArchive === true);

      setArchives(archivedUsers);
    } catch (err) {
      console.error("Archive load error:", err);
      showToast({
        message: "Failed to load archives",
        type: "error",
        color: "#fff",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArchives();
  }, [fetchArchives]);

  /* ================= UNARCHIVE ACTION ================= */

  const handleUnarchive = async (id, username) => {
    if (!window.confirm(`Unarchive ${username}?`)) return;

    try {
      await API.put(`/admins/unarchive/${id}`);

      showToast({
        message: `${username} unarchived`,
        type: "success",
        color: "#fff",
      });

      fetchArchives();
    } catch {
      showToast({
        message: "Failed to unarchive user",
        type: "error",
        color: "#fff",
      });
    }
  };

  /* ================= RENDER ================= */

  return (
    <Loader loading={loading}>
      <h1 className="admin__title">Archive Lissst</h1>
      <p className="admin__description">
        Manage archived users and restore accounts.
      </p>

      <div className="admin__card">
        {archives.length === 0 ? (
          <p>No archived records found.</p>
        ) : (
          <div className="crud-table-scroll">
            <table className="crud-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {archives.map((u) => (
                  <tr key={u.id}>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>

                    <td className="crud-table__actions">
                      <span
                        className="material-symbols-outlined crud-action crud-action--reinstate"
                        title="Unarchive User"
                        onClick={() => handleUnarchive(u.id, u.username)}
                      >
                        unarchive
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Loader>
  );
}

export default ArchiveList;
