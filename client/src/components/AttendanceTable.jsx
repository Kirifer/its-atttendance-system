import { useEffect, useState, useMemo } from "react";
import { getUserAttendance } from "../api/attendance";
import "../styles/AttendanceTable.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function AttendanceTable({ userId, userEmail, firstDay, lastDay, reload }) {
  const [records, setRecords] = useState([]);
  const [filterType, setFilterType] = useState("Month");
  const [filterWeek, setFilterWeek] = useState(1);

  const options = useMemo(() => ({
    year: "numeric",
    month: "short",
    day: "numeric",
  }), []);

  const timeOptions = useMemo(() => ({
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }), []);

  const getWeekOfMonth = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return Math.ceil((date.getDate() + firstDay) / 7);
  };

  const getTotalWeeksInMonth = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    return Math.ceil((lastDate + firstDay) / 7);
  };

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!userId) return;

      try {
        const res = await getUserAttendance(userId);

        // Filter by month, 30-day range
        const monthFiltered = res.attendance.filter((r) => {
          const d = new Date(r.date);
          return d >= firstDay && d <= lastDay;
        });

        // Format table heading and data
        const formatted = monthFiltered.map((r) => {
          const ti = r.timeIn ? new Date(r.timeIn) : null;
          const to = r.timeOut ? new Date(r.timeOut) : null;
          const diff = ti && to ? ((to - ti) / 1000 / 60 / 60).toFixed(2) : "-";

          return {
            Intern: userEmail,
            Date: new Date(r.date).toLocaleDateString("en-US", options),
            Week: getWeekOfMonth(new Date(r.date)),
            "Time In": ti ? ti.toLocaleTimeString("en-US", timeOptions) : "-",
            "Time Out": to ? to.toLocaleTimeString("en-US", timeOptions) : "-",
            TOTAL: diff !== "-" ? `${diff} hrs` : "-",
          };
        });

        // If filterType is "Week", only show selected week
        const finalRecords =
          filterType === "Week"
            ? formatted.filter((r) => getWeekOfMonth(new Date(r.Date)) === filterWeek)
            : formatted;

        setRecords(finalRecords);
      } catch (err) {
        console.error(err);
        setRecords([]);
      }
    };

    fetchAttendance();
  }, [userId, firstDay, lastDay, reload, filterType, filterWeek, userEmail, options, timeOptions]);

  const exportPDF = () => {
    if (!records.length) {
      alert("No data available to export.")
      return;
    }

    const doc = new jsPDF();

    autoTable(doc, {
      head: [Object.keys(records[0])],
      body: records.map(Object.values),
      startY: 25,
      styles: { fontSize: 10 },
    });

    doc.text("Timesheet Report", 14, 15);
    doc.save("timesheet.pdf");
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  
  return (
    <div className="attendance_body">
      <div className="attendance_top_bar">
        {role === "ADMIN" && (
          <button className="attendance_export_btn" onClick={exportPDF}>
            Export
          </button>
        )}

        <div className="attendance_filter_bar">
          <label>
            Filter Type:&nbsp;
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
                {Array.from({ length: getTotalWeeksInMonth(firstDay) }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      </div>

      {records.length === 0 ? (
        <p className="attendance_message">No attendance for this {filterType === "Month" ? "month" : `week ${filterWeek}`}</p>
      ) : (
        <div className="attendance_container">
          <table className="attendance_tbl">
            <thead>
              <tr>
                {Object.keys(records[0]).map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={i}>
                  {Object.values(r).map((v, j) => (
                    <td key={j} data-label={Object.keys(r)[j]}>
                      {v}
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
