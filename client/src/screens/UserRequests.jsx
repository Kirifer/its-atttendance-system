import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import API from "../api/api";
import UserRequestsTable from "../components/UserRequestTable";
import UserLeaveTable from "../components/UserLeaveTable";
import Loader from "../components/Spinner/Loader";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import "../styles/UserRequests.css";

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

function UserRequests() {
  const [userRequests, setUserRequests] = useState([]);
  const [leaves, setLeaves] = useState([]);

  const [filterType, setFilterType] = useState("type");
  const [query, setQuery] = useState("");

  const [leaveFilterType, setLeaveFilterType] = useState("leaveType");
  const [leaveQuery, setLeaveQuery] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const handleChange = (_, newValue) => setValue(newValue);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const response = await API.get("/time-adjustments/my-requests");
      const myRequests = response.data.requests.filter(
        (r) => r.userId === user.id
      );
      setUserRequests(myRequests);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyLeaves = async () => {
    try {
      setLoading(true);
      const response = await API.get("/leave");
      const myLeaves = response.data.filter((l) => l.user?.id === user.id);
      setLeaves(myLeaves);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  return (
    <DashboardLayout>
      <div className="user-time__main">
        <a href="/timesheet" className="x-button">
          X
        </a>
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
          </Tabs>
        </Box>
        <div className="user-time__header-table">
          {/* ---------- TAB 1 ---------- */}
          <CustomTabPanel value={value} index={0}>
            <Loader loading={loading}>
              <h1 className="admin__title">Time Adjustment Requests</h1>
              <p className="admin__description">
                Review your time adjustment requests.
              </p>
              <UserRequestsTable
                requests={userRequests}
                filterType={filterType}
                query={query}
                setFilterType={setFilterType}
                setQuery={setQuery}
              />
            </Loader>
          </CustomTabPanel>

          {/* ---------- TAB 2 ---------- */}
          <CustomTabPanel value={value} index={1}>
            <Loader loading={loading}>
              <h1 className="admin__title">Time-off Requests</h1>
              <p className="admin__description">Review your leave requests.</p>
              <UserLeaveTable
                leaves={leaves}
                filterType={leaveFilterType}
                query={leaveQuery}
                setFilterType={setLeaveFilterType}
                setQuery={setLeaveQuery}
              />
            </Loader>
          </CustomTabPanel>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default UserRequests;
