import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useNavigate, useLocation } from "react-router-dom";
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
import useIsDesktop from "../hooks/useIsDesktop.js";
import PendingApprovals from "../components/PendingApprovals.jsx";
import { getAllStaffUsers } from "../api/auth";

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
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isSupervisor = currentUser?.role === "SUPERVISOR";
  const supervisorDept = currentUser?.department;
  const [visibleUserIds, setVisibleUserIds] = useState(null);

  // Read tab from URL query parameter, default to 0
  const getTabFromUrl = () => {
    const params = new URLSearchParams(location.search);
    const tab = parseInt(params.get("tab"), 10);
    return !isNaN(tab) && tab >= 0 && tab <= 4 ? tab : 0;
  };

  const [value, setValue] = useState(getTabFromUrl());
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  // Update URL when tab changes
  const handleChange = (_, newValue) => {
    setValue(newValue);
    const params = new URLSearchParams(location.search);
    params.set("tab", newValue);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  // Sync state with URL on page load/refresh
  useEffect(() => {
    setValue(getTabFromUrl());
  }, [location.search]);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      if (isSupervisor && supervisorDept && visibleUserIds === null) {
        return;
      }
      const data = await getAllLeaves();
      if (visibleUserIds instanceof Set) {
        setLeaves(
          (data || []).filter((l) => visibleUserIds.has(l.user?.id)),
        );
      } else {
        setLeaves(data);
      }
    } catch (err) {
      console.error("Error fetching leaves:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [visibleUserIds]);

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

  useEffect(() => {
    const loadUsers = async () => {
      if (!isSupervisor || !supervisorDept) {
        setVisibleUserIds(null);
        return;
      }
      try {
        const users = await getAllStaffUsers();
        const allowed = new Set(
          (users || [])
            .filter(
              (u) =>
                u.role === "USER" &&
                u.department === supervisorDept,
            )
            .map((u) => u.id),
        );
        setVisibleUserIds(allowed);
      } catch (err) {
        setVisibleUserIds(new Set());
      }
    };
    loadUsers();
  }, [isSupervisor, supervisorDept]);

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
            <Tab label="Registration Requests" {...a11yProps(0)} />
            <Tab label="Time Adjustments" {...a11yProps(1)} />
            <Tab label="Time-off Requests" {...a11yProps(2)} />
            <Tab label="Admin Management" {...a11yProps(3)} />
            <Tab label="Intern Management" {...a11yProps(4)} />
          </Tabs>
        </Box>

        {/* ---------- TAB 1 ---------- */}
        <CustomTabPanel value={value} index={0}>
          <Loader loading={loading}>
            <h1 className="admin__title">Registration Requests</h1>
            <p className="admin__description">
              Verify and authorize new user accounts for system access.
            </p>
            <PendingApprovals />
          </Loader>
        </CustomTabPanel>

        {/* ---------- TAB 2 ---------- */}
        <CustomTabPanel value={value} index={1}>
          <Loader loading={loading}>
            <h1 className="admin__title">Time Adjustment Requests</h1>
            <p className="admin__description">
              Review and approve employee time adjustment requests.
            </p>
            <TimeAdjustmentTable />
          </Loader>
        </CustomTabPanel>

        {/* ---------- TAB 3 ---------- */}
        <CustomTabPanel value={value} index={2}>
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

        {/* ---------- TAB 4 ---------- */}
        <CustomTabPanel value={value} index={3}>
          <Loader loading={loading}>
            <div>
              <h1 className="admin__title">Admin Management</h1>
              <p className="admin__description">
                Create, update, or remove users.
              </p>
              <AdminCRUD />
            </div>
          </Loader>
        </CustomTabPanel>

        {/* ---------- TAB 5 ---------- */}
        <CustomTabPanel value={value} index={4}>
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
