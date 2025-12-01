import { useState, useEffect } from "react";
import { timeIn, timeOut, getUserAttendance } from "../api/attendance";
import "../styles/TimeInOut.css";

function TimeInOut({ userId, onAttendanceChange }) {
  const [isTimedIn, setIsTimedIn] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  // ✅ Keep hooks at top-level
  useEffect(() => {
    if (role === "ADMIN") return; // skip logic for admin

    const checkToday = async () => {
      const res = await getUserAttendance(userId);
      const today = new Date().toDateString();

      const todayRecord = res.attendance.find(
        (r) => new Date(r.date).toDateString() === today
      );

      setIsTimedIn(todayRecord?.timeIn && !todayRecord?.timeOut);
    };

    checkToday();
  }, [userId, role]);

  const handleTimeIn = async () => {
    try {
      await timeIn();
      setIsTimedIn(true);
      onAttendanceChange();
      alert("Successfully Timed In.");
    } catch (err) {
      alert(err.response?.data?.message || "Already Timed In");
    }
  };

  const handleTimeOut = async () => {
    try {
      await timeOut();
      setIsTimedIn(false);
      onAttendanceChange();
      alert("Successfully Timed Out");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to time out");
    }
  };

  if (role === "ADMIN") return null;

  return (
    <div className="tinout_body">
      <div className="tinout_container">
        <button
          className="tinout_in_btn"
          onClick={handleTimeIn}
          disabled={isTimedIn}
        >
          Time In
        </button>
        <button
          className="tinout_out_btn"
          onClick={handleTimeOut}
          disabled={!isTimedIn}
        >
          Time Out
        </button>
      </div>
    </div>
  );
}

export default TimeInOut;
