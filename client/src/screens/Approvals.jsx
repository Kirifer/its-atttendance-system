import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import {
  getAllLeaves,
  updateLeaveStatus,
  deleteLeave,
} from "../api/leaveAdmin";
import LeaveTable from "../components/LeaveTable";
import TimeAdjustmentTable from "../components/TimeAdjustmentTable";
import AdminCRUD from "../components/AdminCRUD";
import Loader from "../components/Spinner/Loader";
import "../styles/Approvals.css";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SetOjtHours from "../components/HandleInterns/SetOjtHours";
import SetOjtHoursDesktop from "../components/HandleInterns/SetOjtHoursDesktop";
import EditUserSchedule from "../components/HandleInterns/EditUserSchedule";
import EditUserScheduleDesktop from "../components/HandleInterns/EditUserScheduleDesktop";
import useUserSchedule from "../hooks/useUserSchedule.js";

function useIsDesktop(breakpoint = 500) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= breakpoint);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= breakpoint);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isDesktop;
}

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

  const user = JSON.parse(localStorage.getItem("user"));
  const userSchedule = useUserSchedule();

  const isDesktop = useIsDesktop();

  return (
    <DashboardLayout>
      <div className="admin__main">
        {/* Tabs Header */}
        <Box sx={{ width: "100%", borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="Approvals Tabs"
          >
            <Tab label="Time Adjustments" {...a11yProps(0)} />
            <Tab label="Time-off Requests" {...a11yProps(1)} />
            <Tab label="Admin Management" {...a11yProps(2)} />
            <Tab label="Intern Management" {...a11yProps(3)} />
          </Tabs>
        </Box>

        {/* ---------- TAB 1 ---------- */}
        <CustomTabPanel value={value} index={0}>
          <Loader loading={loading}>
            <h1 className="admin__title">Time Adjustment Requests</h1>
            <p className="admin__description">
              Review and approve employee time adjustment requests.
            </p>
            <TimeAdjustmentTable />
          </Loader>
        </CustomTabPanel>

        {/* ---------- TAB 2 ---------- */}
        <CustomTabPanel value={value} index={1}>
          <Loader loading={loading}>
            <h1 className="admin__title">Time-off Requests</h1>
            <p className="admin__description">
              Manage and approve employee leave requests.
            </p>
            <LeaveTable
              leaves={leaves}
              onStatusChange={handleStatusUpdate}
              onDelete={handleDelete}
            />
          </Loader>
        </CustomTabPanel>

        {/* ---------- TAB 3 ---------- */}
        <CustomTabPanel value={value} index={2}>
          <Loader loading={loading}>
            <div>
              <h1 className="admin__title">Admin Management</h1>
              <p className="admin__description">
                Create, update, or remove admin users.
              </p>
              <AdminCRUD />
            </div>
          </Loader>
        </CustomTabPanel>

        {/* ---------- TAB 4 ---------- */}
        <CustomTabPanel value={value} index={3}>
          <Loader loading={loading}>
            <div>
              <h1 className="admin__title">Handle Interns</h1>
              <p className="admin__description">
                Set custom schedule or work hours.
              </p>
              {!isDesktop && (
                <>
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
                </>
              )}
              {isDesktop && (
                <>
                  <EditUserScheduleDesktop
                    userSchedule={userSchedule}
                    user={user}
                  />
                  <SetOjtHoursDesktop />
                </>
              )}
            </div>
          </Loader>
        </CustomTabPanel>
      </div>
    </DashboardLayout>
  );
}

export default Approvals;
