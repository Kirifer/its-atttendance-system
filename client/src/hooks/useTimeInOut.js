import { useState, useEffect } from "react";
import { timeIn, timeOut, getUserAttendance } from "../api/attendance";
import { showToast } from "../components/Notification/toast";

export function useTimeInOut(userId, onAttendanceChange) {
  const [isTimedIn, setIsTimedIn] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  useEffect(() => {
    if (role === "ADMIN") return;

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

      showToast({
        message: "Successfully timed in",
        color: "#ffffff",
        type: "success",
      });

      setIsTimedIn(true);
      onAttendanceChange();


    } catch(err) {
      showToast({
        message: "Failed timed in",
        color: "#ffffff",
        type: "error",
      });

    }

  };

  const handleTimeOut = async () => {
    await timeOut();

    showToast({
      message: "Successfully timed out",
      color: "#ffffff",
      type: "success",
    });

    setIsTimedIn(false);
    onAttendanceChange();

  };

  return {
    role,
    isTimedIn,
    handleTimeIn,
    handleTimeOut
  };
}
