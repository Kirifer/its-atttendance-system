import { useState, useEffect } from "react";
import { breakOut, breakIn, getUserAttendance } from "../api/attendance";
import { showToast } from "../components/Notification/toast";

export function useBreakInOut(userId, reload, onAttendanceChange, isTimedIn) {
  const [canBreakOut, setCanBreakOut] = useState(false);
  const [canBreakIn, setCanBreakIn] = useState(false);
  const [breakOutLoading, setBreakOutLoading] = useState(false);
  const [breakInLoading, setBreakInLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  useEffect(() => {
    if (role === "ADMIN" || !isTimedIn) return;

    const checkBreakState = async () => {
      try {
        const res = await getUserAttendance(userId);
        const today = new Date().toDateString();

        const todayRecord = res.attendance.find(
          (r) => new Date(r.date).toDateString() === today
        );

        if (!todayRecord || !todayRecord.timeIn || todayRecord.timeOut) {
          setCanBreakOut(false);
          setCanBreakIn(false);
          return;
        }

        if (!todayRecord.breakOut) {
          setCanBreakOut(true);
          setCanBreakIn(false);
          return;
        }

        if (todayRecord.breakOut && !todayRecord.breakIn) {
          setCanBreakOut(false);
          setCanBreakIn(true);
          return;
        }

        setCanBreakOut(false);
        setCanBreakIn(false);
      } catch (err) {
        console.error(err);
      }
    };

    checkBreakState();
  }, [userId, role, reload, isTimedIn]);

  const handleBreakOut = async () => {
    if (breakOutLoading) return;

    try {
      setBreakOutLoading(true);
      await breakOut();

      showToast({
        message: "Successfully out for break",
        color: "#ffffff",
        type: "success",
      });

      onAttendanceChange();
    } catch (err) {
      showToast({
        message: err.message || "Failed to break out",
        type: "error",
      });
    } finally {
      setBreakOutLoading(false);
    }
  };

  const handleBreakIn = async () => {
    if (breakInLoading) return;

    try {
      setBreakInLoading(true);
      await breakIn();

      showToast({
        message: "Successfully back from break",
        color: "#ffffff",
        type: "success",
      });

      onAttendanceChange();
    } catch (err) {
      showToast({
        message: err.message || "Failed to break in",
        type: "error",
      });
    } finally {
      setBreakInLoading(false);
    }
  };

  return {
    role,
    canBreakOut,
    canBreakIn,
    handleBreakOut,
    handleBreakIn,
    breakOutLoading,
    breakInLoading,
  };
}
