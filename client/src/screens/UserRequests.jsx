import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import API from "../api/api";
import "../styles/UserRequests.css";
import "../styles/ViewRequestTable.css";

function UserRequests() {
  const user = JSON.parse(localStorage.getItem("user"));

  // Time adjustments
  const [userRequests, setUserRequests] = useState([]);

  // Readable human language for viewing requests
  const typeLabels = {
    change_log: "Change Log Request",
    change_shift: "Change Shift Schedule",
    offset_hours: "Offset Extended Hours",
    overtime: "Overtime",
    undertime: "Undertime",
  };

  // fetch requests
  const fetchMyRequests = async () => {
    try {
      const response = await API.get("/time-adjustments/my-requests");
      const myRequests = response.data.requests.filter(
        (r) => r.userId === user.id
      );
      setUserRequests(myRequests);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  return (
    <DashboardLayout>
      <div>
        {/* Go back */}
        <a
          href="/timesheet"
          className="x-button"
          style={{ textDecoration: "none", textAlign: "center" }}
        >
          X
        </a>

        {/* User's Requests */}
        <div className="user-requests">
          <h3>My Time Adjustment Requests</h3>
          {userRequests.length === 0 ? (
            <p>No requests submitted yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Details</th>
                  <th>Status</th>
                  <th>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {userRequests.map((req) => (
                  <tr key={req.id}>
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

export default UserRequests;
