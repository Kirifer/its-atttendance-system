import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { getAllLeaves, updateLeaveStatus, deleteLeave } from "../api/leaveAdmin";
import "../styles/TimeoffAdmin.css";

function TimeoffAdmin() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      const data = await getAllLeaves();
      setLeaves(data);
    } catch (err) {
      console.error("Error fetching leaves:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    await updateLeaveStatus(id, status);
    fetchLeaves();
  };

  const handleDelete = async (id) => {
    await deleteLeave(id);
    fetchLeaves();
  };

  if (loading) return <DashboardLayout><div>Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="admin-container">
        <h2>Manage Leave Requests</h2>

        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Type</th>
              <th>Dates</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.id}>
                <td>{leave.userId}</td>
                <td>{leave.leaveType}</td>
                <td>{leave.startDate} → {leave.endDate}</td>
                <td>{leave.reason}</td>
                <td>{leave.status}</td>

                <td>
                  <button onClick={() => handleStatusUpdate(leave.id, "APPROVED")}>Approve</button>
                  <button onClick={() => handleStatusUpdate(leave.id, "REJECTED")}>Reject</button>
                  <button onClick={() => handleDelete(leave.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export default TimeoffAdmin;
