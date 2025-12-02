import { useState } from "react";
import AttendanceTable from "../components/AttendanceTable";
import DashboardLayout from "../components/DashboardLayout";
import TimeAdjustmentModal from "../components/TimeAdjustmentModal";
import "../styles/AttendanceTable.css";
import "../styles/DateRange.css";

function Timesheet() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [reload, setReload] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  // Time adjustment
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <div>
      <DashboardLayout>
        <h1>Timesheet</h1>
        <button onClick={() => setIsModalOpen(true)}>
          + File Time Adjustment
        </button>

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

        <div className="attendance_head">
          <h1>Timesheet</h1>
        </div>

        <AttendanceTable
          userId={user.id}
          userEmail={user.email}
          firstDay={firstDay}
          lastDay={lastDay}
          reload={reload}
        />
      </DashboardLayout>
    </div>
  );
}

export default Timesheet;
