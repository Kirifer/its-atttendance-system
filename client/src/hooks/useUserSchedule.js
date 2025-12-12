import { useState } from "react";
import axios from "axios";

export default function useUserSchedule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Set or update user schedule
  const setSchedule = async ({ userId, weekday, startTime, endTime }) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.post("/api/attendance/schedule/user", {
        userId,
        weekday,
        startTime,
        endTime,
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
  const editAttendance = async ({ attendanceId, timeIn, timeOut, lunchOut, lunchIn, status }) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.put(`/api/attendance/${attendanceId}`, {
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
