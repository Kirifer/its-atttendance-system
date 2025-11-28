import React, { useState, useEffect } from "react";
import "../../styles/Clock.css";

export default function Clock({ format = "HH:mm:ss", ticking = true }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    if (!ticking) return;
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [ticking]);

  const formatTime = (date) => {
    const pad = (num) => String(num).padStart(2, "0");
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return format
      .replace("HH", hours)
      .replace("mm", minutes)
      .replace("ss", seconds);
  };

  const getDateString = (date) => {
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="clock-live-card">
      <div className="clock-live-label">Today's Time</div>
      <div className="clock-live-time">{formatTime(time)}</div>
      <div className="clock-live-date">{getDateString(time)}</div>
    </div>
  );
}
