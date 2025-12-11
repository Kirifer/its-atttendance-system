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
      <h3 className="title">My Time Adjustment Requests</h3>
      <div className="time-requests">
        {/* Go back */}
        <a href="/timesheet" className="x-button">
          X
        </a>

        {userRequests.length === 0 ? (
          <p>No requests submitted yet.</p>
        ) : (
          <div className="time-table-container">
            <table className="time-table" style={{ tableLayout: "auto" }}>
              <thead>
                <tr>
                  <th>Type</th>
                  <th style={{ minWidth: "250px" }}>Reason</th>
                  <th>Status</th>
                  <th>Attachment</th>
                  <th>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {userRequests.map((req) => {
                  const status = req.status ? req.status.toLowerCase() : "";

                  const fullAttachmentUrl = req.attachment
                    ? `${
                        process.env.REACT_APP_BACKEND_URL ||
                        "http://localhost:5001"
                      }${req.attachment}`
                    : null;

                  return (
                    <tr key={req.id}>
                      <td data-label="Type">
                        {typeLabels[req.type] || req.type}
                      </td>
                      <td
                        data-label="Details"
                        style={{
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                        }}
                      >
                        {req.details}
                      </td>
                      <td
                        data-label="Status"
                        className={`time-table__status time-table__status--${status}`}
                      >
                        {req.status.toUpperCase()}
                      </td>

                      <td
                        data-label="Attachment"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {fullAttachmentUrl ? (
                          <a
                            href={fullAttachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View / Download
                          </a>
                        ) : (
                          "No Attachment"
                        )}
                      </td>

                      <td data-label="Submitted At">
                        {new Date(req.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default UserRequests;
