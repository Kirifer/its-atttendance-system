import { useEffect, useState } from "react";
import API from "../api/api";
import "../styles/PendingApprovals.css";
import { showToast } from "./Notification/toast";

const PendingApprovals = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("username");
  const [query, setQuery] = useState("");

  const fetchPending = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/admins/pending-users");
      setUsers(data || []);
    } catch (err) {
      console.error("Failed to fetch pending users", err);
      showToast({
        message: "Failed to fetch pending users",
        type: "error",
        color: "#fff",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (userId, action) => {
    const confirmMsg =
      action === "approve"
        ? "Authorize this registration and grant system access?"
        : "Deny registration and permanently remove this record?";

    if (!window.confirm(confirmMsg)) return;

    try {
      if (action === "approve") {
        await API.patch(`/admins/approve/${userId}`);
      } else {
        await API.delete(`/admins/reject/${userId}`);
      }

      setUsers((prev) => prev.filter((u) => u.id !== userId));

      showToast({
        message: `User successfully ${action === "approve" ? "approved" : "removed"}.`,
        type: "success",
        color: "#fff",
      });
    } catch (error) {
      showToast({
        message: "An error occurred while processing the request.",
        type: "error",
        color: "#fff",
      });
    }
  };

  const filteredUsers = users.filter((user) => {
    const value = filterType === "username" ? user.username : user.email;
    return value?.toLowerCase().includes(query.toLowerCase());
  });

  if (loading) return <p style={{ padding: "20px" }}>Loading requests...</p>;

  return (
    <div>
      <div className="pending-table__search">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="pending-table__dropdown"
        >
          <option value="username">Username</option>
          <option value="email">Email</option>
        </select>

        <input
          type="text"
          placeholder={`Search by ${filterType}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pending-table__input"
        />
      </div>

      <div className="pending-table-container">
        <table className="pending-table">
          <thead>
            <tr>
              {/* Removed ID header */}
              <th>Username</th>
              <th>Email</th>
              <th>Date Requested</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No pending registration requests found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <p>{user.username}</p>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    {new Date(user.created_at).toLocaleDateString()}, &nbsp;
                    {new Date(user.created_at).toLocaleTimeString()}
                  </td>
                  <td className="pending-table__actions">
                    <span
                      className="material-symbols-outlined pending-table__approve"
                      title="Accept User"
                      onClick={() => handleAction(user.id, "approve")}
                    >
                      check_circle
                    </span>

                    <span
                      className="material-symbols-outlined pending-table__delete"
                      title="Delete Troll/Fake Account"
                      style={{ color: "#ff4d4d", cursor: "pointer" }}
                      onClick={() => handleAction(user.id, "delete")}
                    >
                      delete_forever
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingApprovals;
