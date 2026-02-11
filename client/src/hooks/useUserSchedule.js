import { useState } from "react";
import API from "../api/api";

export default function useUserSchedule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showSchedule, setShowSchedule] = useState(false);
  const [reload, setReload] = useState(false);

  const openSchedule = () => setShowSchedule(true);
  const closeSchedule = () => setShowSchedule(false);
  const triggerReload = () => setReload((r) => !r);

  const setSchedule = async ({ userId, weekday, startTime, endTime, date }) => {
    try {
      setLoading(true);
      setError(null);

      let computedWeekday = weekday;
      if (date) {
        const d = new Date(date);
        computedWeekday = d.getDay();
      }

      // FIXED: Changed endpoint to match backend route
      const res = await API.post("/admins/set-schedule", {
        userId,
        weekday: computedWeekday,
        startTime,
        endTime,
        date,
      });

      triggerReload();
      return res.data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error setting schedule");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // EDIT ATTENDANCE
  const editAttendance = async ({
    attendanceId,
    timeIn,
    timeOut,
    lunchOut,
    lunchIn,
    status,
  }) => {
    try {
      setLoading(true);
      setError(null);

      const res = await API.put(`/attendance/${attendanceId}`, {
        timeIn,
        timeOut,
        lunchOut,
        lunchIn,
        status,
      });

      triggerReload();
      return res.data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error updating attendance");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    reload,
    showSchedule,

    openSchedule,
    closeSchedule,

    setSchedule,
    editAttendance,
  };
}
