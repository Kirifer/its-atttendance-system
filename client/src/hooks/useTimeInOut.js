import { useState, useEffect } from "react";
import { timeIn, timeOut, getUserAttendance } from "../api/attendance";

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
    await timeIn();
    setIsTimedIn(true);
    onAttendanceChange();
    alert("Successfully Timed In.");
  };

  const handleTimeOut = async () => {
    await timeOut();
    setIsTimedIn(false);
    onAttendanceChange();
    alert("Successfully Timed Out");
  };

  return {
    role,
    isTimedIn,
    handleTimeIn,
    handleTimeOut
  };
}
