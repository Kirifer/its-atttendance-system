import React, { useEffect, useState, useMemo } from "react";
import { getUserAttendance } from "../../api/attendance";
import "../../styles/LogsCard.css";

function LogsCard({ userName = "User", reload }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const [logs, setLogs] = useState([]);

  const options = useMemo(() => ({
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }), []);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!userId) return;

      try {
        const res = await getUserAttendance(userId);
        const sortedLogs = res.attendance
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3)
          .map(r => {
            const ti = r.timeIn ? new Date(r.timeIn) : null;
            const to = r.timeOut ? new Date(r.timeOut) : null;

            return {
              timeIn: ti ? ti.toLocaleTimeString("en-US", options) : "-",
              timeOut: to ? to.toLocaleTimeString("en-US", options) : "-",
            };
          });

        setLogs(sortedLogs);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      }
    };

    fetchLogs();
  }, [userId, options, reload]); // <-- add reload
  return (
    <div className="logs-card">
      <div className="logs-card__header">
        <span>
          {user?.todaySchedule
            ? `${user.todaySchedule.startTime} - ${user.todaySchedule.endTime}`
            : "No schedule today"}
        </span>
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
