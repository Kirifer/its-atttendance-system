import React, { useEffect, useState } from "react";
import "../styles/AttendanceTable.css";
import { dummyAttendance } from "../api/attendanceData.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function AttendanceTable() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    setRecords(dummyAttendance.users);
  }, []);

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
    </div>
  );
}
