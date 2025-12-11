import React, { useState } from "react";
import "../styles/LeaveTable.css";
import { showToast } from "./Notification/toast";
import "../styles/ViewRequestTable.css";

<link
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
  rel="stylesheet"
/>;

function ViewRequestTable({ requests, onStatusChange, onDelete }) {
  const [filterType, setFilterType] = useState("id");
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  // Labels for human-readable display
  const typeLabels = {
    change_log: "Change Log Request",
    change_shift: "Change Shift Schedule",
    offset_hours: "Offset Extended Hours",
    overtime: "Overtime",
    undertime: "Undertime",
    SICK: "Sick Leave",
    VACATION: "Vacation",
    HOLIDAY: "Holiday",
    OFFSET: "Offset Hours",
  };

  const coverageLabels = {
    FULL_DAY: "Full Day",
    HALF_DAY: "Half Day",
  };

  const filteredRequests = requests.filter((req) => {
    const value =
      filterType === "id"
        ? String(req.id)
        : filterType === "leaveType" || filterType === "type"
        ? typeLabels[req.type] || req.type
        : filterType === "reason"
        ? req.reason
        : filterType === "coverage"
        ? coverageLabels[req.coverage] || req.coverage
        : filterType === "status"
        ? req.status
        : filterType === "intern" || filterType === "username"
        ? req.intern || req.user?.username || ""
        : "";

    return value.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="user-requests">
      <div className="leave-table__search">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="leave-table__dropdown"
        >
          <option value="id">ID</option>
          <option value="type">Type</option>
          <option value="coverage">Coverage</option>
          <option value="reason">Reason</option>
          <option value="intern">Intern</option>
          <option value="status">Status</option>
        </select>

        <input
          type="text"
          placeholder={`Search by ${filterType}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="leave-table__input"
        />
      </div>

      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Reason</th>
              <th>Intern</th>
              <th>Coverage</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Attachment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((req) => {
              const status = (req.status || "").toUpperCase();

              return (
                <tr key={`${req.source}-${req.id}`}>
                  <td data-label="ID">{req.id}</td>
                  <td data-label="Type">{typeLabels[req.type] || req.type}</td>
                  <td data-label="Reason" className="reason">
                    {req.reason}
                  </td>
                  <td data-label="Intern">
                    {req.intern || req.user?.username || "N/A"}
                  </td>
                  <td data-label="Coverage">
                    {coverageLabels[req.coverage] || req.coverage || "-"}
                  </td>
                  <td data-label="Duration" style={{ whiteSpace: "nowrap" }}>
                    {req.duration || "-"}
                  </td>
                  <td data-label="Status" className={`status ${status}`}>
                    {status}
                  </td>
                  <td data-label="Attachment" style={{ whiteSpace: "nowrap" }}>
                    {req.attachment || "No Attachment"}
                  </td>
                  <td data-label="Actions" style={{ whiteSpace: "nowrap" }}>
                    {status === "PENDING" && (
                      <>
                        <span
                          className="material-symbols-outlined admin-accept-btn"
                          onClick={() => {
                            if (!window.confirm("Approve this request?"))
                              return;
                            onStatusChange(req.id, req.source, "APPROVED")
                              .then(() =>
                                showToast({
                                  message: "Approved!",
                                  type: "success",
                                  color: "#fff",
                                })
                              )
                              .catch((err) =>
                                showToast({
                                  message: err.message || "Failed",
                                  type: "error",
                                  color: "#fff",
                                })
                              );
                          }}
                        >
                          check_circle
                        </span>
                        <span
                          className="material-symbols-outlined admin-decline-btn"
                          onClick={() => {
                            if (!window.confirm("Reject this request?")) return;
                            onStatusChange(req.id, req.source, "REJECTED")
                              .then(() =>
                                showToast({
                                  message: "Rejected!",
                                  type: "success",
                                  color: "#fff",
                                })
                              )
                              .catch((err) =>
                                showToast({
                                  message: err.message || "Failed",
                                  type: "error",
                                  color: "#fff",
                                })
                              );
                          }}
                        >
                          x_circle
                        </span>
                      </>
                    )}
                    <span
                      className="material-symbols-outlined admin-delete-btn"
                      onClick={() => {
                        if (!window.confirm("Delete this request?")) return;
                        onDelete(req.id, req.source)
                          .then(() =>
                            showToast({
                              message: "Deleted!",
                              type: "success",
                              color: "#fff",
                            })
                          )
                          .catch((err) =>
                            showToast({
                              message: err.message || "Failed",
                              type: "error",
                              color: "#fff",
                            })
                          );
                      }}
                    >
                      delete
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewRequestTable;
