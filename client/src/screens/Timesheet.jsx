import { useEffect, useState } from "react";
import AttendanceTable from "../components/AttendanceTable";
import DashboardLayout from "../components/DashboardLayout";
import TimeAdjustmentModal from "../components/TimeAdjustmentModal";
import API from "../api/api";
import "../styles/AttendanceTable.css";
import "../styles/DateRange.css";
import "../styles/TimeAdjustmentModal.css";
import "../styles/ViewRequestTable.css";

function Timesheet() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [reload, setReload] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  // Time adjustment
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeAdjustments, setTimeAdjustments] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [showUserRequests, setShowUserRequests] = useState(false);

  // Readable human language for viewing requests
  const typeLabels = {
    change_log: "Change Log Request",
    change_shift: "Change Shift Schedule",
    offset_hours: "Offset Extended Hours",
    overtime: "Overtime",
    undertime: "Undertime",
  };

  // hide/show submitted requests
  const toggleUserRequests = async () => {
    if (!showUserRequests) {
      // Only fetch when opening
      try {
        const response = await API.get("/time-adjustments/my-requests");
        const myRequests = response.data.requests.filter(
          (r) => r.userId === user.id
        );
        setUserRequests(myRequests);
      } catch (error) {
        console.error(error);
      }
    }
    setShowUserRequests((prev) => !prev);
  };

  // fetch requests (admin view)
  const fetchRequests = async () => {
    try {
      const response = await API.get("/time-adjustments");
      setTimeAdjustments(response.data.requests); // All requests (for admin)
    } catch (error) {
      console.error(error);
    }
  };

  // fetch requests (user view)
  const fetchMyRequests = async () => {
    try {
      const response = await API.get("/time-adjustments/my-requests");
      const myRequests = response.data.requests.filter(
        (r) => r.userId === user.id
      );
      setUserRequests(myRequests);
      setShowUserRequests(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Date range calculation
  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  return (
    <DashboardLayout>
      <div className="dashboard-main" style={{ position: "relative" }}>
        <div className="time-adjustment-buttons">
          {!showUserRequests && (
            <button
              className="time-adjustment-box"
              onClick={() => setIsModalOpen(true)}
            >
              + &nbsp;&nbsp; File time adjustment
            </button>
          )}

          <button className="time-adjustment-box" onClick={toggleUserRequests}>
            {showUserRequests ? "Hide My Requests" : "View my requests"}
          </button>
        </div>

        <TimeAdjustmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        {showUserRequests ? (
          <div className="user-requests">
            <h3>My Time Adjustment Requests</h3>
            {userRequests.length === 0 ? (
              <p>No requests submitted yet.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Details</th>
                    <th>Status</th>
                    <th>Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {userRequests.map((req) => (
                    <tr key={req.id}>
                      <td data-label="Type">
                        {typeLabels[req.type] || req.type}
                      </td>
                      <td data-label="Details">{req.details}</td>
                      <td
                        data-label="Status"
                        className={`status ${req.status.toLowerCase()}`}
                      >
                        {req.status}
                      </td>
                      <td data-label="Submitted At">
                        {new Date(req.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <>
            <div className="daterange_container">
              <button className="daterange_btn" onClick={handlePrevMonth}>
                &larr;
              </button>

              <div className="daterange_bar">
                Date Range: {firstDay.toLocaleDateString()} -{" "}
                {lastDay.toLocaleDateString()}
              </div>

              <button className="daterange_btn" onClick={handleNextMonth}>
                &rarr;
              </button>
            </div>
          
            <AttendanceTable
              userId={user.id}
              userEmail={user.email}
              firstDay={firstDay}
              lastDay={lastDay}
              reload={reload}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Timesheet;
