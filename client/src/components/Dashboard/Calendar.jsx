import React, { useState } from "react";
import Calendar from "react-calendar";
import "../../styles/Calendar.css"; 

function DashboardCalendar() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="calendar-card">
      <Calendar
        onChange={setDate}
        value={date}
        className="react-calendar"
      />

      <div style={{ marginTop: "12px", fontSize: "14px", color: "#444" }}>
        Selected: <strong>{date.toDateString()}</strong>
      </div>
    </div>
  );
}

export default DashboardCalendar;
