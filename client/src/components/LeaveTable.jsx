import React, { useState } from "react";
import "../styles/LeaveTable.css";
import { showToast } from "./Notification/toast";

<link
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
  rel="stylesheet"
/>;

function LeaveTable({ leaves, onStatusChange, onDelete }) {
  const [filterType, setFilterType] = useState("id");
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  // Time off proper labeling
  const leaveTypeLabels = {
    SICK: "Sick Leave",
    VACATION: "Vacation",
    HOLIDAY: "Holiday",
    OFFSET: "Offset Hours",
  };

  const coverageTypeLabels = {
    FULL_DAY: "Full Day",
    HALF_DAY: "Half Day",
  };


  // Custom filter request placeholder names
  const placeholderMap = {
    id: "id",
    leaveType: "request type",
    coverage: "coverage",
    reason: "reason",
    username: "username",
    status: "status",
  };

  const filteredLeaves = leaves.filter((leave) => {
    const value =
      filterType === "id"
        ? String(leave.id)
        : filterType === "leaveType"
        ? leave.leaveType
        : filterType === "reason"
        ? leave.reason
        : filterType === "coverage"
        ? leave.coverage
        : filterType === "status"
        ? leave.status
        : filterType === "username"
        ? leave.user?.username || ""
        : "";

    return value.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div>
      <div className="leave-table__search">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="leave-table__dropdown"
        >
          <option value="id">ID</option>
          <option value="leaveType">Request Type</option>
          <option value="reason">Reason</option>
          <option value="username">Intern Username</option>
          <option value="coverage">Coverage</option>
          <option value="status">Status</option>
        </select>

        <input
          type="text"
          placeholder={`Search by ${placeholderMap[filterType]}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="leave-table__input"
        />
      </div>
      <div className="leave-table-container">
        <table className="leave-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Request Type</th>
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
            {filteredLeaves.map((leave) => (
              <tr key={leave.id}>
                <td
                  onClick={() =>
                    setExpandedId(expandedId === leave.id ? null : leave.id)
                  }
                >
                  {expandedId === leave.id
                    ? leave.id
                    : leave.id.substring(0, 8) + "..."}
                </td>

                <td>{leaveTypeLabels[leave.leaveType || leave.leaveType]}</td>
                <td
                  style={{
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    minWidth: "250px",
                    maxWidth: "600px",
                    paddingRight: "12px",
                  }}
                >
                  {leave.reason}
                </td>
                <td>{leave.user ? leave.user.username : "N/A"}</td>
                <td>
                  {coverageTypeLabels[leave.coverage] || coverageTypeLabels}
                </td>
                <td>
                  {leave.startDate.slice(0, 10)} → {leave.endDate.slice(0, 10)}
                </td>
                <td
                  className={`leave-table__status leave-table__status--${leave.status.toLowerCase()}`}
                >
                  {leave.status}
                </td>

                <td>
                  {leave.attachment ? (
                    <a
                      href={leave.attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View / Download
                    </a>
                  ) : (
                    "No Attachment"
                  )}
                </td>

                <td className="leave-table__actions">
                  <span
                    className="material-symbols-outlined leave-table__approve"
                    onClick={() => {
                      const confirmed = window.confirm(
                        "Are you sure you want to approve this leave?"
                      );
                      if (!confirmed) return;

                      onStatusChange(leave.id, "APPROVED")
                        .then(() =>
                          showToast({
                            message: "Leave approved successfully!",
                            type: "success",
                            color: "#ffffff",
                          })
                        )
                        .catch((err) =>
                          showToast({
                            message: err.message || "Failed to approve leave",
                            type: "error",
                            color: "#ffffff",
                          })
                        );
                    }}
                    title="Approve"
                  >
                    check_circle
                  </span>

                  <span
                    className="material-symbols-outlined leave-table__reject"
                    onClick={() => {
                      const confirmed = window.confirm(
                        "Are you sure you want to reject this leave?"
                      );
                      if (!confirmed) return;

                      onStatusChange(leave.id, "REJECTED")
                        .then(() =>
                          showToast({
                            message: "Leave rejected successfully!",
                            type: "success",
                            color: "#ffffff",
                          })
                        )
                        .catch((err) =>
                          showToast({
                            message: err.message || "Failed to reject leave",
                            type: "error",
                            color: "#ffffff",
                          })
                        );
                    }}
                    title="Reject"
                  >
                    cancel
                  </span>

                  <span
                    className="material-symbols-outlined leave-table__delete"
                    onClick={() => {
                      const confirmed = window.confirm(
                        "Are you sure you want to delete this leave?"
                      );
                      if (!confirmed) return;

                      onDelete(leave.id)
                        .then(() =>
                          showToast({
                            message: "Leave deleted successfully!",
                            type: "success",
                            color: "#ffffff",
                          })
                        )
                        .catch((err) =>
                          showToast({
                            message: err.message || "Failed to delete leave",
                            type: "error",
                            color: "#ffffff",
                          })
                        );
                    }}
                    title="Delete"
                  >
                    delete
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeaveTable;
