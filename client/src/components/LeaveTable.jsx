import React from "react";
import "../styles/LeaveTable.css";

function LeaveTable({ leaves, onStatusChange, onDelete }) {
  return (
    <table className="leave-table">
      <thead>
        <tr>
          <th>User</th>
          <th>Type</th>
          <th>Reason</th>
          <th>Duration</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {leaves.map((leave) => (
          <tr key={leave.id}>
            <td>{leave.user ? leave.user.username : "N/A"}</td>
            <td>{leave.leaveType}</td>
            <td>{leave.reason}</td>
            <td>{leave.startDate.slice(0,10)} → {leave.endDate.slice(0,10)}</td>
            <td>{leave.status}</td>

            <td className="leave-table__actions">
              <button
                className="leave-table__approve"
                onClick={() => onStatusChange(leave.id, "APPROVED")}
              >
                Approve
              </button>

              <button
                className="leave-table__reject"
                onClick={() => onStatusChange(leave.id, "REJECTED")}
              >
                Reject
              </button>

              <button
                className="leave-table__delete"
                onClick={() => onDelete(leave.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default LeaveTable;
