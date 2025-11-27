import React from "react";
import "../../styles/LogsCard.css";

function LogsCard({ logs = [], userName = "User" }) {
  return (
    <div className="logs-card">
      <div className="logs-card__header">
        <span>9:00 AM - 6:00 PM</span>
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
