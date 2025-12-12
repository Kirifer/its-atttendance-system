import { useState } from "react";
import API from "../api/api"; // use your configured Axios instance

export default function useUserSchedule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Set or update user schedule (with optional date)
  const setSchedule = async ({ userId, weekday, startTime, endTime, date }) => {
    try {
      setLoading(true);
      setError(null);

      // If date is provided, calculate weekday from it
      let computedWeekday = weekday;
      if (date) {
        const d = new Date(date);
        computedWeekday = d.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      }

      const res = await API.post("/attendance/schedule/user", {
        userId,
        weekday: computedWeekday,
        startTime,
        endTime,
        date,
      });

      return res.data; // { message, schedule }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error setting schedule");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Edit attendance even after submission
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

      return res.data; // { message, updated }
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
    setSchedule,
    editAttendance,
  };
}
