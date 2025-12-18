import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import {
  getAllLeaves,
  updateLeaveStatus,
  deleteLeave,
} from "../api/leaveAdmin";
import LeaveTable from "../components/LeaveTable";
import "../styles/EditUserSchedule.css";
import "../styles/Approvals.css";
import TimeAdjustmentTable from "../components/TimeAdjustmentTable";
import AdminCRUD from "../components/AdminCRUD";
import EditUserSchedule from "../components/EditUserSchedule.jsx";
import useUserSchedule from "../hooks/useUserSchedule.js"
import SetOjtHours from "../components/SetOjtHours.jsx";

function Approvals() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const userSchedule = useUserSchedule();

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
        <h1 className="admin__title"> Time Adjustment Requests</h1>
        <p className="admin__description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec leo
          diam, interdum nec placerat in, venenatis egestas justo. Nam eu
          gravida ante, vel egestas turpis.
        </p>
        <TimeAdjustmentTable />
        <br></br>
        <br></br>
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
        <br></br>
        <br></br>
        <h1 className="admin__title">Admin Management</h1>
        <p className="admin__description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec leo
          diam, interdum nec placerat in, venenatis egestas justo. Nam eu
          gravida ante, vel egestas turpis.
        </p>
        <AdminCRUD />
        <h1 className="admin__title">Handle Interns</h1>
        <p className="admin__description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec leo
          diam, interdum nec placerat in, venenatis egestas justo. Nam eu
          gravida ante, vel egestas turpis.
        </p>
        <div className="custom_schedule_wrapper">
          <EditUserSchedule userSchedule={userSchedule} user={user} />
          <button
            className="custom_schedule_btn"
            onClick={userSchedule.openSchedule}
          >
            Set Custom Schedule
          </button>
          <SetOjtHours />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Approvals;
