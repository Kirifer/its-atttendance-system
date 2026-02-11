import { useState } from "react";
import { updateAttendance } from "../api/attendance";
import EditAttendanceLoader from "./EditAttendanceLoader";
import "../styles/EditAttendancePopup.css";

export default function EditAttendancePopup({ record, onClose, onSave }) {
  const [timeIn, setTimeIn] = useState(
    record["Time In"] !== "-" ? record["Time In"] : "",
  );
  const [lunchOut, setLunchOut] = useState(
    record["Lunch Out"] !== "-" ? record["Lunch Out"] : "",
  );
  const [lunchIn, setLunchIn] = useState(
    record["Lunch In"] !== "-" ? record["Lunch In"] : "",
  );

  const [breakOut, setBreakOut] = useState(
    record["Break Out"] !== "-" ? record["Break Out"] : ""
  );

  const [breakIn, setBreakIn] = useState(
    record["Break In"] !== "-" ? record["Break In"] : ""
  );

  const [timeOut, setTimeOut] = useState(
    record["Time Out"] !== "-" ? record["Time Out"] : "",
  );
  const [status, setStatus] = useState(record.status || "PRESENT");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);

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
        lunchIn: formatTime(lunchIn),
        lunchOut: formatTime(lunchOut),
        breakOut: formatTime(breakOut),
        breakIn: formatTime(breakIn),
        status, // include status
      });

      onSave();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update attendance");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="attendance_popup_overlay">
      {saving && <EditAttendanceLoader />}
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

        <label>Break Out:</label>
        <input
          type="time"
          value={breakOut}
          onChange={(e) => setBreakOut(e.target.value)}
        />

        <label>Break In:</label>
        <input
          type="time"
          value={breakIn}
          onChange={(e) => setBreakIn(e.target.value)}
        />
        
        <label>Time Out:</label>
        <input
          type="time"
          value={timeOut}
          onChange={(e) => setTimeOut(e.target.value)}
        />

        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="PRESENT">Present</option>
          <option value="TARDY">Tardy</option>
          <option value="ABSENT">Absent</option>
          <option value="ON_LEAVE">On Leave</option>
        </select>

        <div className="attendance_popup_buttons">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
