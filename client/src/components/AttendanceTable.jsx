import { useEffect, useState, useMemo } from "react";
import { getUserAttendance, getAllAttendance } from "../api/attendance";
import "../styles/AttendanceTable.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import EditAttendancePopup from "./EditAttendancePopup";

export default function AttendanceTable({
  userId,
  userEmail,
  firstDay,
  lastDay,
}) {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const [records, setRecords] = useState([]);
  const [filterType, setFilterType] = useState("Month");
  const [filterWeek, setFilterWeek] = useState(1);

  const [editingRecord, setEditingRecord] = useState(null);
  const [reloadCounter, setReloadCounter] = useState(0);

  const [searchField, setSearchField] = useState("Intern");
  const [query, setQuery] = useState("");

  const options = useMemo(
    () => ({
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    []
  );

  const timeOptions = useMemo(
    () => ({
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }),
    []
  );

  const getWeekOfMonth = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return Math.ceil((date.getDate() + firstDay) / 7);
  };

  const getTotalWeeksInMonth = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const lastDate = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
    return Math.ceil((lastDate + firstDay) / 7);
  };

  const reload = () => setReloadCounter((prev) => prev + 1); // refresh table

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!userId) return;
      try {
        let res;
        if (role === "ADMIN") res = await getAllAttendance();
        else res = await getUserAttendance(userId);

        const monthFiltered = res.attendance.filter((r) => {
          const d = new Date(r.date);
          return d >= firstDay && d <= lastDay;
        });

        const formatted = monthFiltered.map((r) => {
          const ti = r.timeIn ? new Date(r.timeIn) : null;
          const to = r.timeOut ? new Date(r.timeOut) : null;
          const diff = ti && to ? ((to - ti) / 1000 / 60 / 60).toFixed(2) : "-";

          return {
            id: r.id,
            rawDate: r.date,
            rawTimeIn: r.timeIn,
            rawTimeOut: r.timeOut,
            Intern: role === "ADMIN" ? r.user.email : userEmail,
            Status: r.status,
            Date: new Date(r.date).toLocaleDateString("en-US", options),
            Week: getWeekOfMonth(new Date(r.date)),
            "Time In": ti ? ti.toLocaleTimeString("en-US", timeOptions) : "-",
            "Time Out": to ? to.toLocaleTimeString("en-US", timeOptions) : "-",
            TOTAL: diff !== "-" ? `${diff} hrs` : "-",
          };
        });

        const finalRecords =
          filterType === "Week"
            ? formatted.filter(
                (r) => getWeekOfMonth(new Date(r.Date)) === filterWeek
              )
            : formatted;

        setRecords(finalRecords);
      } catch (err) {
        console.error(err);
        setRecords([]);
      }
    };

    fetchAttendance();
  }, [
    userId,
    firstDay,
    lastDay,
    filterType,
    filterWeek,
    userEmail,
    reloadCounter,
    options,
    timeOptions,
    role,
  ]);

  const exportPDF = () => {
    if (!records.length) {
      alert("No data available to export.");
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

  const openEditPopup = (record) => setEditingRecord(record);
  const closeEditPopup = () => setEditingRecord(null);

  const filteredRecords = records.filter((r) => {
    if (!query) return true;
    const fieldValue = r[searchField];
    if (!fieldValue) return false;
    return fieldValue.toString().toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="attendance_body">
      <div className="leave-table__search" style={{ marginBottom: "10px" }}>
        <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          className="leave-table__dropdown"
        >
          <option value="id">ID</option>
          <option value="Intern">Intern Email</option>
          <option value="Status">Status</option>
          <option value="Date">Date</option>
        </select>
        <input
          type="text"
          placeholder={`Search by ${searchField}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="leave-table__input"
        />
      </div>
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
              Week:&nbsp;
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
        <p className="attendance_message">
          No attendance for this{" "}
          {filterType === "Month" ? "month" : `week ${filterWeek}`}
        </p>
      ) : (
        <div className="attendance_container">
          <table className="attendance_tbl">
            <thead>
              <tr>
                {Object.keys(records[0])
                  .filter(
                    (col) =>
                      !["rawDate", "rawTimeIn", "rawTimeOut", "id"].includes(
                        col
                      )
                  )
                  .map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((r, i) => (
                <tr key={i}>
                  {Object.keys(r)
                    .filter(
                      (col) =>
                        !["rawDate", "rawTimeIn", "rawTimeOut", "id"].includes(
                          col
                        )
                    )
                    .map((col) => (
                      <td key={col} data-label={col}>
                        {col === "Status" ? (
                          <span
                            className={`attendance_status-${r[col]
                              .toLowerCase()
                              .replace("_", "-")}`}
                          >
                            {r[col]}
                          </span>
                        ) : (
                          r[col]
                        )}
                      </td>
                    ))}
                  <td>
                    {role === "ADMIN" && (
                      <button
                        className="attendance_edit_btn"
                        onClick={() => openEditPopup(r)}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editingRecord && (
        <EditAttendancePopup
          record={editingRecord}
          onClose={closeEditPopup}
          onSave={reload}
        />
      )}
    </div>
  );
}
