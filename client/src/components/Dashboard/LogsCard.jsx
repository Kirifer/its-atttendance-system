import React, { useEffect, useState, useMemo } from "react";
import { getUserAttendance } from "../../api/attendance";
import "../../styles/LogsCard.css";

function LogsCard({ userName = "User", reload }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const [liveSchedule, setLiveSchedule] = useState(null);
  const [logs, setLogs] = useState([]);

  const options = useMemo(
    () => ({
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }),
    [],
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const formatTime = (timeStr) => timeStr || "-";

  useEffect(() => {
    const fetchLogs = async () => {
      if (!userId) return;

      try {
        const res = await getUserAttendance(userId);

        if (res.todaySchedule) {
          setLiveSchedule(res.todaySchedule);
        } else {
          setLiveSchedule(null);
        }

        const sortedLogs = res.attendance
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3)
          .map((r) => {
            const ti = r.timeIn ? new Date(r.timeIn) : null;
            const to = r.timeOut ? new Date(r.timeOut) : null;

            const dateLabel = formatDate(r.date);

            return {
              timeIn: ti
                ? `${dateLabel}: ${ti.toLocaleTimeString("en-US", options)}`
                : `${dateLabel}: -`,
              timeOut: to
                ? `${dateLabel}: ${to.toLocaleTimeString("en-US", options)}`
                : `${dateLabel}: -`,
            };
          });

        setLogs(sortedLogs);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      }
    };

    fetchLogs();
  }, [userId, options, reload]);

  const renderSchedule = () => {
    if (!liveSchedule) return "Loading schedule..."; // Change from "No schedule today"

    const cleanTime = (t) => {
      if (!t) return "-";
      // If backend sends the string "11:00", this returns it immediately
      if (typeof t === "string" && t.length === 5) return t;

      try {
        const d = new Date(t);
        const h = d.getUTCHours().toString().padStart(2, "0");
        const m = d.getUTCMinutes().toString().padStart(2, "0");
        return `${h}:${m}`;
      } catch (e) {
        return "-";
      }
    };

    return `${cleanTime(liveSchedule.startTime)} - ${cleanTime(liveSchedule.endTime)}`;
  };

  return (
    <div className="logs-card">
      <div className="logs-card__header">
        <span>{renderSchedule()}</span>
        <span>{userName}</span>
      </div>
      <div className="logs-card__body">
        <div className="logs-card__title">Logs</div>
        <div className="logs-card__table-container">
          <table className="logs-card__table">
            <thead>
              <tr>
                <th>Time in</th>
                <th>Time out</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <tr key={index}>
                    <td>{log.timeIn}</td>
                    <td>{log.timeOut}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">No logs available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LogsCard;
