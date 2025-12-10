import { useState } from "react";
import { updateAttendance } from "../api/attendance";
import "../styles/EditAttendancePopup.css";

export default function EditAttendancePopup({ record, onClose, onSave }) {
  const [timeIn, setTimeIn] = useState(
    record["Time In"] !== "-" ? record["Time In"] : ""
  );
  const [timeOut, setTimeOut] = useState(
    record["Time Out"] !== "-" ? record["Time Out"] : ""
  );
  const [lunchOut, setLunchOut] = useState(
    record["Lunch Out"] !== "-" ? record["Lunch Out"] : ""
  );
  const [lunchIn, setLunchIn] = useState(
    record["Lunch In"] !== "-" ? record["Lunch In"] : ""
  );

  const handleSave = async () => {
    try {
      const date = new Date(record.rawDate);
      const formatTime = (t) => {
        if (!t) return null;
        const [hours, minutes, seconds] = t.split(":");
        const dt = new Date(date);
        dt.setHours(hours, minutes, seconds || 0, 0);
        return dt;
      };

      await updateAttendance(record.id, {
        timeIn: formatTime(timeIn),
        timeOut: formatTime(timeOut),
        lunchOut: formatTime(lunchOut),
        lunchIn: formatTime(lunchIn),
      });

      onSave();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update attendance");
    }
  };

  return (
    <div className="attendance_popup_overlay">
      <div className="attendance_popup">
        <h2>Edit Attendance</h2>

        <label>Time In:</label>
        <input
          type="time"
          value={timeIn}
          onChange={(e) => setTimeIn(e.target.value)}
        />
        
        <label>Lunch Out:</label>
        <input
          type="time"
          value={lunchOut}
          onChange={(e) => setLunchOut(e.target.value)}
        />

        <label>Lunch In:</label>
        <input
          type="time"
          value={lunchIn}
          onChange={(e) => setLunchIn(e.target.value)}
        />

        <label>Time Out:</label>
        <input
          type="time"
          value={timeOut}
          onChange={(e) => setTimeOut(e.target.value)}
        />


        <div className="attendance_popup_buttons">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
