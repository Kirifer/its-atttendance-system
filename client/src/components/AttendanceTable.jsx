import React, { useEffect, useState } from "react";
import "../styles/AttendanceTable.css";
import { dummyAttendance } from "../api/attendanceData.js";

export default function AttendanceTable() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    setRecords(dummyAttendance.users);
  }, []);

  return (
    <div className="attendance_body">
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
