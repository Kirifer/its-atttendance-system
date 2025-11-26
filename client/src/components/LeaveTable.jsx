import React from "react";
import "../styles/LeaveTable.css";
<link
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
  rel="stylesheet"
/>;

function LeaveTable({ leaves, onStatusChange, onDelete }) {
  return (
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
          {leaves.map((leave) => (
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
  );
}

export default LeaveTable;
