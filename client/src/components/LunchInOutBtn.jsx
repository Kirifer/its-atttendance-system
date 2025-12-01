import { useState, useEffect } from "react";
import { lunchOut, lunchIn, getUserAttendance } from "../api/attendance";
import "../styles/LunchInOut.css";

function LunchInOutBtn({ userId, reload, onAttendanceChange }) {
  const [canLunchOut, setCanLunchOut] = useState(false);
  const [canLunchIn, setCanLunchIn] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  useEffect(() => {
    if (role === "ADMIN") return;

    const checkLunchState = async () => {
      const res = await getUserAttendance(userId);
      const today = new Date().toDateString();

      const todayRecord = res.attendance.find(
        (r) => new Date(r.date).toDateString() === today
      );

      if (!todayRecord || !todayRecord.timeIn || todayRecord.timeOut) {
        setCanLunchOut(false);
        setCanLunchIn(false);
        return;
      }

      // TIMED IN → Lunch Out enabled
      if (!todayRecord.lunchOut) {
        setCanLunchOut(true);
        setCanLunchIn(false);
        return;
      }

      // OUT FOR LUNCH → Lunch In enabled
      if (todayRecord.lunchOut && !todayRecord.lunchIn) {
        setCanLunchOut(false);
        setCanLunchIn(true);
        return;
      }

      // BACK FROM LUNCH
      setCanLunchOut(false);
      setCanLunchIn(false);
    };

    checkLunchState();
  }, [userId, role, reload]);

  const handleLunchOut = async () => {
    try {
      await lunchOut();
      onAttendanceChange();
      alert("Out for lunch.");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLunchIn = async () => {
    try {
      await lunchIn();
      onAttendanceChange();
      alert("Back from lunch.");
    } catch (err) {
      alert(err.message);
    }
  };

  if (role === "ADMIN") return null;

  return (
    <div className="lunchio_body">
      <div className="lunchio_container">
        <button
          className="lunch_out_btn"
          onClick={handleLunchOut}
          disabled={!canLunchOut}
        >
          Out for Lunch
        </button>

        <button
          className="lunch_in_btn"
          onClick={handleLunchIn}
          disabled={!canLunchIn}
        >
          Back from Lunch
        </button>
      </div>
    </div>
  );
}

export default LunchInOutBtn;
