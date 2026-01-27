import { useState, useEffect } from "react";
import { lunchOut, lunchIn, getUserAttendance } from "../api/attendance";
import { showToast } from "../components/Notification/toast";

export function useLunchInOut(userId, reload, onAttendanceChange) {
  const [canLunchOut, setCanLunchOut] = useState(false);
  const [canLunchIn, setCanLunchIn] = useState(false);
  const [lunchOutLoading, setLunchOutLoading] = useState(false);
  const [lunchInLoading, setLunchInLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  useEffect(() => {
    if (role === "ADMIN") return;

    const checkLunchState = async () => {
      try {
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
      } catch (err) {
        console.error(err);
      }
    };

    checkLunchState();
  }, [userId, role, reload]);

  const handleLunchOut = async () => {
    if (lunchOutLoading) return;

    try {
      setLunchOutLoading(true);
      await lunchOut();

      showToast({
        message: "Successfully out for lunch",
        color: "#ffffff",
        type: "success",
      });

      onAttendanceChange();
    } catch (err) {
      showToast({
        message: err.message || "Failed to lunch out",
        type: "error",
      });
    } finally {
      setLunchOutLoading(false);
    }
  };

  const handleLunchIn = async () => {
    if (lunchInLoading) return;

    try {
      setLunchInLoading(true);
      await lunchIn();

      showToast({
        message: "Successfully back from lunch",
        color: "#ffffff",
        type: "success",
      });

      onAttendanceChange();
    } catch (err) {
      showToast({
        message: err.message || "Failed to lunch in",
        type: "error",
      });
    } finally {
      setLunchInLoading(false);
    }
  };

  return {
    role,
    canLunchOut,
    canLunchIn,
    handleLunchOut,
    handleLunchIn,
    lunchOutLoading,
    lunchInLoading,
  };
}