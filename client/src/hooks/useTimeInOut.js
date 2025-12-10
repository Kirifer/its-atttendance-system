import { useState, useEffect } from "react";
import { timeIn, timeOut, getUserAttendance } from "../api/attendance";
import { showToast } from "../components/Notification/toast";
import API from "../api/api"; // <-- needed for /me

export function useTimeInOut(userId, onAttendanceChange) {
  const [isTimedIn, setIsTimedIn] = useState(false);
  const [onLeave, setOnLeave] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  useEffect(() => {
    if (role === "ADMIN") return;

    const init = async () => {
      try {
        // 1. Fetch today's attendance
        const res = await getUserAttendance(userId);
        const today = new Date().toDateString();

        const todayRecord = res.attendance.find(
          (r) => new Date(r.date).toDateString() === today
        );

        setIsTimedIn(todayRecord?.timeIn && !todayRecord?.timeOut);

        // 2. Fetch updated user info (includes onLeave)
        const userRes = await API.get("/auth/me");
        const updatedUser = userRes.data;

        setOnLeave(updatedUser.onLeave);

        // update localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));

      } catch (err) {
        console.error("Error initializing attendance:", err);
      }
    };

    init();
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

    } catch (err) {
      showToast({
        message: err?.response?.data?.message || "Failed to time in",
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
    handleTimeOut,
    onLeave,  // <-- now correct & real-time synced
  };
}
