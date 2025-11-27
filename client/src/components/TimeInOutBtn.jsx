import { useState, useEffect } from "react";
import { timeIn, timeOut, getUserAttendance } from "../api/attendance";
import "../styles/TimeInOut.css";

function TimeInOut({ userId, onAttendanceChange }) {
  const [isTimedIn, setIsTimedIn] = useState(false);

  useEffect(() => {
    const checkToday = async () => {
      const res = await getUserAttendance(userId);
      const today = new Date().toDateString();

      const todayRecord = res.attendance.find(
        (r) => new Date(r.date).toDateString() === today
      );

      if (todayRecord?.timeIn && !todayRecord?.timeOut) {
        setIsTimedIn(true);
      } else {
        setIsTimedIn(false);
      }
    };

    checkToday();
  }, [userId]);

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
      alert("Successfully Timed Out.");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to time out");
    }
  };

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
