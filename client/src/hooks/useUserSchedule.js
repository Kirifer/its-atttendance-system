import { useState } from "react";
import API from "../api/api"; 

export default function useUserSchedule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Set or update user schedule 
  const setSchedule = async ({ userId, weekday, startTime, endTime, date }) => {
    try {
      setLoading(true);
      setError(null);

      // calculate weekday 
      let computedWeekday = weekday;
      if (date) {
        const d = new Date(date);
        computedWeekday = d.getDay(); 
      }

      const res = await API.post("/attendance/schedule/user", {
        userId,
        weekday: computedWeekday,
        startTime,
        endTime,
        date,
      });

      return res.data; 
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
    setSchedule,
    editAttendance,
  };
}
