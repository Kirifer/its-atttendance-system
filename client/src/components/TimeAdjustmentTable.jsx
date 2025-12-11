import { useEffect, useState } from "react";
import API from "../api/api";
import "../styles/TimeAdjustmentTable.css";
import { showToast } from "./Notification/toast";

function TimeAdjustmentTable() {
  const [allRequests, setAllRequests] = useState([]);

  const typeLabels = {
    change_log: "Change Log Request",
    change_shift: "Change Shift Schedule",
    offset_hours: "Offset Extended Hours",
    overtime: "Overtime",
    undertime: "Undertime",
  };

  useEffect(() => {
    const fetchAllRequests = async () => {
      try {
        const response = await API.get("/time-adjustments", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setAllRequests(response.data.requests);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllRequests();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await API.put(`/time-adjustments/${id}/status`, { status });

      setAllRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: status.toLowerCase() } : req
        )
      );

      showToast({
        message: `Request ${status.toLowerCase()} successfully`,
        type: "success",
        color: "#fff",
      });
    } catch (err) {
      console.error(err);
      showToast({
        message: "Failed to update request",
        type: "error",
        color: "#fff",
      });
    }
  };

  return (
    <div className="time-table-container">
      <table className="time-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Type</th>
            <th>Details</th>
            <th>Status</th>
            <th>Submitted At</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {allRequests.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                No time adjustment requests yet.
              </td>
            </tr>
          ) : (
            allRequests.map((req) => (
              <tr key={req.id}>
                <td>{req.id.substring(0, 8)}...</td>
                <td>{req.user?.username || "Unknown"}</td>
                <td>{typeLabels[req.type] || req.type}</td>
                <td>{req.details}</td>

                <td
                  className={`time-status time-status--${req.status.toLowerCase()}`}
                >
                  {req.status}
                </td>

                <td>{new Date(req.createdAt).toLocaleString()}</td>

                <td className="time-table__actions">
                  {req.status === "pending" && (
                    <>
                      <span
                        className="material-symbols-outlined time-table__approve"
                        title="Approve"
                        onClick={() =>
                          handleUpdateStatus(req.id, "APPROVED")
                        }
                      >
                        check_circle
                      </span>

                      <span
                        className="material-symbols-outlined time-table__reject"
                        title="Reject"
                        onClick={() =>
                          handleUpdateStatus(req.id, "REJECTED")
                        }
                      >
                        cancel
                      </span>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TimeAdjustmentTable;
