import React, { useEffect, useState } from "react";
import "../styles/AttendanceTable.css";
import { dummyAttendance } from "../api/attendanceData.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function AttendanceTable({ firstDay, lastDay }) {
  const [records, setRecords] = useState([]);

  useEffect(() => {

    const filtered = dummyAttendance.users.filter(user => {
      const recordDate = new Date(user["Date"]);
      return recordDate >= firstDay && recordDate <= lastDay;
    });

    setRecords(filtered);
  }, [firstDay, lastDay]);

  const exportPDF = () => {

    const doc = new jsPDF();
    const tableColumn = Object.keys(records[0]);
    const tableRows = records.map((row) => Object.values(row));
    doc.setFontSize(16);
    doc.text("Timesheet Report", 14, 15);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: { fontSize: 10 }
    });
    doc.save("timesheet.pdf");
  };

  return (
    <div className="attendance_body">
      <div className="attendance_export_bar">
        <button className="attendance_export_btn" onClick={exportPDF}>
          Export
        </button>
      </div>

      {records.length === 0 ? (
        <>
          <div className="attendance_container">
            <table className="attendance_tbl">
              <thead>
                <tr>
                  {dummyAttendance.users[0] &&
                    Object.keys(dummyAttendance.users[0]).map((col, i) => <th key={i}>{col}</th>)}
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
                  Object.keys(records[0]).map((col, i) => <th key={i}>{col}</th>)}
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
