import { useEffect, useState } from "react";
import AttendanceTable from "../components/AttendanceTable";
import DashboardLayout from "../components/DashboardLayout";
import TimeAdjustmentModal from "../components/TimeAdjustmentModal";
import API from "../api/api";
import "../styles/AttendanceTable.css";
import "../styles/DateRange.css";
import "../styles/TimeAdjustmentModal.css";

function Timesheet() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [reload, setReload] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeAdjustments, setTimeAdjustments] = useState([]);

  const isAdmin = user?.role === "ADMIN";

  // fetch requests
  const fetchRequests = async () => {
    try {
      const response = await API.get("/time-adjustments");
      setTimeAdjustments(response.data.requests);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Date range
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
        {!isAdmin && (
          <div className="time-adjustment-buttons">
            <button
              className="time-adjustment-box"
              onClick={() => setIsModalOpen(true)}
            >
              <span class="material-symbols-outlined">add</span>
            </button>

            <a
              href="/my-requests"
              className="time-adjustment-box"
              style={{ textDecoration: "none", textAlign: "center" }}
            >
              View my requests
            </a>
          </div>
        )}

        <TimeAdjustmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

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
      </div>
    </DashboardLayout>
  );
}

export default Timesheet;
