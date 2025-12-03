import { useState, useEffect } from "react";
import { lunchOut, lunchIn, getUserAttendance } from "../api/attendance";
import { showToast } from "../components/Notification/toast";

export function useLunchInOut(userId, reload, onAttendanceChange) {
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

      if (!todayRecord.lunchOut) {
        setCanLunchOut(true);
        setCanLunchIn(false);
        return;
      }

      if (todayRecord.lunchOut && !todayRecord.lunchIn) {
        setCanLunchOut(false);
        setCanLunchIn(true);
        return;
      }

      setCanLunchOut(false);
      setCanLunchIn(false);
    };

    checkLunchState();
  }, [userId, role, reload]);

  const handleLunchOut = async () => {
    await lunchOut();

    showToast({
      message: "Successfully out for lunch",
      color: "#ffffff",
      type: "success",
    });

    onAttendanceChange();

  };

  const handleLunchIn = async () => {
    await lunchIn();

    showToast({
      message: "Successfully back from lunch",
      color: "#ffffff",
      type: "success",
    });

    onAttendanceChange();

  };

  return {
    role,
    canLunchOut,
    canLunchIn,
    handleLunchOut,
    handleLunchIn
  };
}
