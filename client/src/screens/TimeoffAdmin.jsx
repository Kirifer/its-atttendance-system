import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import {
  getAllLeaves,
  updateLeaveStatus,
  deleteLeave,
} from "../api/leaveAdmin";
import LeaveTable from "../components/LeaveTable";
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

  if (loading)
    return (
      <DashboardLayout>
        <div className="admin__loading">Loading...</div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="admin__main">
        <h1 className="admin__title">Time-off Requests</h1>
        <p className="admin__description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec leo
          diam, interdum nec placerat in, venenatis egestas justo. Nam eu
          gravida ante, vel egestas turpis.
        </p>
        <LeaveTable
          leaves={leaves}
          onStatusChange={handleStatusUpdate}
          onDelete={handleDelete}
        />
      </div>
    </DashboardLayout>
  );
}

export default TimeoffAdmin;
