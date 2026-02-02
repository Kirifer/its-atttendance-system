import { useState, useEffect } from "react";
import { timeIn, timeOut, getUserAttendance } from "../api/attendance";
import { showToast } from "../components/Notification/toast";
import API from "../api/api"; 

export function useTimeInOut(userId, onAttendanceChange) {
  const [isTimedIn, setIsTimedIn] = useState(false);
  const [onLeave, setOnLeave] = useState(false);
  const [totalOJTHours, setTotalOJTHours] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  useEffect(() => {
    if (role === "ADMIN") return;

    const init = async () => {
      try {
        const res = await getUserAttendance(userId);
        const today = new Date().toDateString();

        const todayRecord = res.attendance.find(
          (r) => new Date(r.date).toDateString() === today
        );

        setIsTimedIn(todayRecord?.timeIn && !todayRecord?.timeOut);
        setOnLeave(todayRecord?.status === "ON_LEAVE");

        const userRes = await API.get("/auth/me");
        setTotalOJTHours(userRes.data.totalOJTHours);

        localStorage.setItem("user", JSON.stringify(userRes.data));
      } catch (err) {
        console.error(err);
      } finally {
        setIsInitializing(false);
      }
    };

    init();
  }, [userId, role]);

  const handleTimeIn = async () => {
    if (loadingAction) return;

    if (!isInitializing && totalOJTHours === null) {
      return showToast({
        message: "Please contact HR/Admin to update your OJT hours",
        color: "#ffffff",
        type: "warning",
      });
    }

    try {
      setLoadingAction(true);
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
        message: err.message || "Failed to time in",
        color: "#ffffff",
        type: "error",
      });
    } finally {
      setLoadingAction(false);
    }
  };

  const handleTimeOut = async () => {
    if (loadingAction) return;

    try {
      setLoadingAction(true);
      await timeOut();

      showToast({ 
        message: "Successfully timed out", 
        color: "#ffffff",
        type: "success" 
      });
      setIsTimedIn(false);
      onAttendanceChange();
    } finally {
      setLoadingAction(false);
    }
  };

  return {
    role,
    isTimedIn,
    handleTimeIn,
    handleTimeOut,
    onLeave,
    totalOJTHours,
    isInitializing,
    loadingAction,
  };
}