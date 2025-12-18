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
import TimeAdjustmentTable from "../components/TimeAdjustmentTable";
import AdminCRUD from "../components/AdminCRUD";
import Loader from "../components/Spinner/Loader";
import "../styles/Approvals.css"
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

function CustomTabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `approvals-tab-${index}`,
    "aria-controls": `approvals-tabpanel-${index}`,
  };
}

function Approvals() {
  const [value, setValue] = useState(0);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleChange = (_, newValue) => setValue(newValue);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
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
