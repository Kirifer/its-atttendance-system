import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import API from "../api/api";
import "../styles/ViewRequestsAdmin.css";
import "../styles/ViewRequestTable.css";

function ViewRequestsAdmin() {
  const [allRequests, setAllRequests] = useState([]);

  // Readable human language for viewing requests
  const typeLabels = {
    change_log: "Change Log Request",
    change_shift: "Change Shift Schedule",
    offset_hours: "Offset Extended Hours",
    overtime: "Overtime",
    undertime: "Undertime",
  };

  // fetch all user requests
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

  // Accept and decline user requests
  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await API.put(`/time-adjustments/${id}/status`, {
        status,
      });
      // update state
      setAllRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: status.toLowerCase() } : req
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update request status");
    }
  };

  return (
    <DashboardLayout>
      <div>
        {/* All Users' Requests */}
        <div className="user-requests">
          <h3>User Time Adjustment Requests</h3>
          {allRequests.length === 0 ? (
            <p>No requests submitted yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Type</th>
                  <th>Details</th>
                  <th>Status</th>
                  <th>Submitted At</th>
                  <th>Actions </th>
                </tr>
              </thead>
              <tbody>
                {allRequests.map((req) => (
                  <tr key={req.id}>
                    <td data-label="User">{req.user?.username || "Unknown"}</td>
                    <td data-label="Type">
                      {typeLabels[req.type] || req.type}
                    </td>
                    <td data-label="Details">{req.details}</td>
                    <td
                      data-label="Status"
                      className={`status ${req.status.toLowerCase()}`}
                    >
                      {req.status}
                    </td>
                    <td data-label="Submitted At">
                      {new Date(req.createdAt).toLocaleString()}
                    </td>
                    <td data-label="Actions">
                      {req.status.toLowerCase() === "pending" && (
                        <>
                          <button
                            className="admin-accept-btn"
                            onClick={() =>
                              handleUpdateStatus(req.id, "APPROVED")
                            }
                          >
                            <span className="material-symbols-outlined">
                              check
                            </span>
                            &nbsp;&nbsp;&nbsp;Accept
                          </button>
                          <button
                            className="admin-decline-btn"
                            onClick={() =>
                              handleUpdateStatus(req.id, "REJECTED")
                            }
                          >
                            <span className="material-symbols-outlined">
                              close
                            </span>
                            &nbsp;&nbsp;&nbsp;Decline
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ViewRequestsAdmin;
