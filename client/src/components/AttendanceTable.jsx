import React, { useEffect, useState } from "react";
import "../styles/AttendanceTable.css";
import { dummyAttendance } from "../api/attendanceData.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function AttendanceTable({ firstDay, lastDay }) {
  const [records, setRecords] = useState([]);

  const [filterType, setFilterType] = useState("Month");
  const [filterWeek, setFilterWeek] = useState(1);

  function getWeekOfMonth(date) {
    const firstDayOfMonth = new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    ).getDay(); // 0=Sunday
    return Math.ceil((date.getDate() + firstDayOfMonth) / 7);
  }

  function getTotalWeeksInMonth(date) {
    const firstDayOfMonth = new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    ).getDay();
    const lastDate = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
    return Math.ceil((lastDate + firstDayOfMonth) / 7);
  }

  useEffect(() => {
    const filtered = dummyAttendance.users.filter((user) => {
      const recordDate = new Date(user["Date"]);

      if (recordDate < firstDay || recordDate > lastDay) return false;

      if (filterType === "Week") {
        return getWeekOfMonth(recordDate) === filterWeek;
      }

      return true;
    });

    setRecords(filtered);
  }, [firstDay, lastDay, filterType, filterWeek]);

  const exportPDF = () => {
    if (records.length === 0) {
      alert("No data available to export.");
      return;
    }

    const doc = new jsPDF();
    const tableColumn = Object.keys(records[0]);
    const tableRows = records.map((row) => Object.values(row));
    doc.setFontSize(16);
    doc.text("Timesheet Report", 14, 15);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: { fontSize: 10 },
    });
    doc.save("timesheet.pdf");
  };

  return (
    <div className="attendance_body">
      <div className="attendance_top_bar">
        <button className="attendance_export_btn" onClick={exportPDF}>
          Export
        </button>

        <div className="attendance_filter_bar" style={{ marginBottom: "10px" }}>
          <label>
            Filter Type:{" "}
            <select
              className="attendance_filter_btn"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="Month">Month</option>
              <option value="Week">Week</option>
            </select>
          </label>

          {filterType === "Week" && (
            <label style={{ marginLeft: "10px" }}>
              Week:{" "}
              <select
                className="attendance_filter_btn"
                value={filterWeek}
                onChange={(e) => setFilterWeek(Number(e.target.value))}
              >
                {Array.from(
                  { length: getTotalWeeksInMonth(firstDay) },
                  (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  )
                )}
              </select>
            </label>
          )}
        </div>
      </div>

      {records.length === 0 ? (
        <>
          <div className="attendance_container">
            <table className="attendance_tbl">
              <thead>
                <tr>
                  {dummyAttendance.users[0] &&
                    Object.keys(dummyAttendance.users[0]).map((col, i) => (
                      <th key={i}>{col}</th>
                    ))}
                </tr>
              </thead>
            </table>
          </div>
          <p className="attendance_message">No attendance for this month</p>
        </>
      ) : (
        <div className="attendance_container">
          <table className="attendance_tbl">
            <thead>
              <tr>
                {records[0] &&
                  Object.keys(records[0]).map((col, i) => (
                    <th key={i}>{col}</th>
                  ))}
              </tr>
            </thead>

            <tbody>
              {records.map((record, i) => (
                <tr key={i}>
                  {Object.entries(record).map(([colName, val], j) => (
                    <td key={j} data-label={colName}>
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
