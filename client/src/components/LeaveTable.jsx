import React from "react";
import "../styles/LeaveTable.css";
import { useState } from "react";
<link
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
  rel="stylesheet"
/>;

function LeaveTable({ leaves, onStatusChange, onDelete }) {
 const [filterType, setFilterType] = useState("id");
  const [query, setQuery] = useState("");

  const filteredLeaves = leaves.filter((leave) => {
    const value =
      filterType === "id"
        ? String(leave.id)
        : filterType === "leaveType"
        ? leave.leaveType
        : filterType === "reason"
        ? leave.reason
        : filterType === "status"
        ? leave.status
        : filterType === "username"
        ? (leave.user?.username || "")
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
          <option value="leaveType">Leave Type</option>
          <option value="reason">Reason</option>
          <option value="username">Intern Username</option>
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
      <div className="leave-table-container">
        <table className="leave-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Reason</th>
              <th>Intern</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredLeaves.map((leave) => (
              <tr key={leave.id}>
                <td>{leave.id}</td>
                <td>{leave.leaveType}</td>
                <td>{leave.reason}</td>
                <td>{leave.user ? leave.user.username : "N/A"}</td>
                <td>
                  {leave.startDate.slice(0, 10)} → {leave.endDate.slice(0, 10)}
                </td>
                <td
                  className={`leave-table__status leave-table__status--${leave.status.toLowerCase()}`}
                >
                  {leave.status}
                </td>

                <td className="leave-table__actions">
                  <span
                    className="material-symbols-outlined leave-table__approve"
                    onClick={() => onStatusChange(leave.id, "APPROVED")}
                    title="Approve"
                  >
                    check_circle
                  </span>

                  <span
                    className="material-symbols-outlined leave-table__reject"
                    onClick={() => onStatusChange(leave.id, "REJECTED")}
                    title="Reject"
                  >
                    cancel
                  </span>

                  <span
                    className="material-symbols-outlined leave-table__delete"
                    onClick={() => onDelete(leave.id)}
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
