import { useState } from "react";
import AttendanceTable from "../components/AttendanceTable";
import DashboardLayout from "../components/DashboardLayout";
import "../styles/AttendanceTable.css";
import "../styles/DateRange.css";

function Timesheet() {
  const [currentDate, setCurrentDate] = useState(new Date());

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

        <AttendanceTable firstDay={firstDay} lastDay={lastDay} />
      </DashboardLayout>
    </div>
  );
}

export default Timesheet;
