import { useEffect, useState, useMemo } from "react";
import { getUserAttendance, getAllAttendance } from "../api/attendance";
import { formatAttStatus } from "../hooks/formatAttStatus";
import useExportPDF from "../hooks/useExportPDF";
import useIsDesktop from "../hooks/useIsDesktop";
import EditAttendancePopup from "./EditAttendancePopup";
import FilterAttendanceActions from "./FilterAttendanceActions";
import FilterAttendanceActionsMobile from "./FilterAttendanceActionsMobile";
import { formatHoursToHHMM } from "../hooks/formatHours";
import usePagination from "../hooks/pagination";
import Pagination from "./Pagination";
import Loader from "./Spinner/Loader";
import "../styles/AttendanceTable.css";

export default function AttendanceTable({
  userId,
  username,
  firstDay,
  lastDay,
}) {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const [records, setRecords] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [reloadCounter, setReloadCounter] = useState(0);
  const [loading, setLoading] = useState(true);

  const isDesktop = useIsDesktop();

  const [filters, setFilters] = useState({
    filterType: "Month",
    filterWeek: 1,
    searchField: "Intern",
    query: "",
    customStart: "",
    customEnd: "",
  });

  const {
    filterType,
    filterWeek,
    searchField,
    query,
    customStart,
    customEnd,
  } = filters;

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

  const reload = () => setReloadCounter((prev) => prev + 1);

  const getWeekOfMonth = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return Math.ceil((date.getDate() + firstDay) / 7);
  };

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!userId) return;

      setLoading(true);

      try {
        let res;
        if (role === "ADMIN") res = await getAllAttendance();
        else res = await getUserAttendance(userId);

        let dateFiltered = res.attendance;

        if (filterType === "Month") {
          dateFiltered = res.attendance.filter((r) => {
            const d = new Date(r.date);
            return d >= firstDay && d <= lastDay;
          });
        }

        if (filterType === "Week") {
          // Filter only by month first
          let monthFiltered = res.attendance.filter((r) => {
            const d = new Date(r.date);
            return d >= firstDay && d <= lastDay;
          });

          dateFiltered = monthFiltered.filter(
            (r) => getWeekOfMonth(new Date(r.date)) === filterWeek
          );
        }

        // --- CUSTOM RANGE FILTER ---
        if (filterType === "Custom") {
          if (customStart && customEnd) {
            const start = new Date(customStart + "T00:00:00");
            const end = new Date(customEnd + "T23:59:59");
            end.setHours(23, 59, 59);

            dateFiltered = res.attendance.filter((r) => {
              const d = new Date(r.date);
              return d >= start && d <= end;
            });
          }
        }

        const formatted = dateFiltered.map((r) => {
          const ti = r.timeIn ? new Date(r.timeIn) : null;
          const to = r.timeOut ? new Date(r.timeOut) : null;

          const lo = r.lunchOut ? new Date(r.lunchOut) : null;
          const li = r.lunchIn ? new Date(r.lunchIn) : null;

          // const workMinutes = ti && to ? Math.round((to - ti) / 1000 / 60) : null;

          // const lunchMinutes = 60;

          const lunchTardyMinutes = r.lunchTardinessMinutes || 0;

          const tardyMinutes = r.tardinessMinutes || 0;

          const presentDays = res.workDays[String(r.userId)] || 0;

          return {
            id: r.id,
            rawDate: r.date,
            rawTimeIn: r.timeIn,
            rawTimeOut: r.timeOut,
            rawLunchOut: r.lunchOut,
            rawLunchIn: r.lunchIn,

            Intern: role === "ADMIN" ? r.user.username : user.username,
            Status: r.status,
            Date: new Date(r.date).toLocaleDateString("en-US", options),
            "Time In": ti ? ti.toLocaleTimeString("en-US", timeOptions) : "-",
            "Lunch Out": lo ? lo.toLocaleTimeString("en-US", timeOptions) : "-",
            "Lunch In": li ? li.toLocaleTimeString("en-US", timeOptions) : "-",
            "Time Out": to ? to.toLocaleTimeString("en-US", timeOptions) : "-",
            "Lunch Tardy": lunchTardyMinutes > 0 ? `${lunchTardyMinutes} mins` : "-",
            Tardiness: tardyMinutes > 0 ? `${tardyMinutes} mins` : "-",
            DAYS: presentDays,
            TOTAL: r.straightWorkHours !== null ? formatHoursToHHMM(r.straightWorkHours) : "-",
            ACTUAL: r.totalWorkHours !== null ? formatHoursToHHMM(r.totalWorkHours) : "-",
          };
        });

        setRecords(formatted);
      } catch (err) {
        console.error(err);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [
    userId,
    firstDay,
    lastDay,
    filterType,
    filterWeek,
    customStart,
    customEnd,
    user.username,
    reloadCounter,
    options,
    timeOptions,
    role,
  ]);

  const { exportPDF } = useExportPDF();

  const openEditPopup = (record) => setEditingRecord(record);
  const closeEditPopup = () => setEditingRecord(null);

  const filteredRecords = records.filter((r) => {
    if (!query) return true;
    const fieldValue = r[searchField];
    if (!fieldValue) return false;
    return fieldValue.toString().toLowerCase().includes(query.toLowerCase());
  });

  const {
    currentPage,
    totalPages,
    paginatedData,
    nextPage,
    prevPage,
    goToPage,
  } = usePagination(filteredRecords, 10);

  return (
    <div className="attendance_body">
      <h1 className="attendance_head">Timesheet</h1>

      {isDesktop ? (
        <FilterAttendanceActions
          role={role}
          firstDay={firstDay}
          exportPDF={exportPDF}
          filteredRecords={filteredRecords}
          onFilterChange={setFilters}
        />
      ) : (
        <FilterAttendanceActionsMobile
          role={role}
          firstDay={firstDay}
          exportPDF={exportPDF}
          filteredRecords={filteredRecords}
          onFilterChange={setFilters}
        />
      )}
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={prevPage}
        onNext={nextPage}
        onGoTo={goToPage}
      />

      <Loader loading={loading}>
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
                      !["rawDate", "rawTimeIn", "rawTimeOut", "rawLunchOut", "rawLunchIn", "id"].includes(
                        col
                      )
                  )
                  .map((col) => (
                    <th key={col}>{col}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((r, i) => (
                <tr key={i}>
                  {Object.keys(r)
                    .filter(
                      (col) =>
                        !["rawDate", "rawTimeIn", "rawTimeOut", "rawLunchOut", "rawLunchIn", "id"].includes(
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
                            {formatAttStatus(r[col])}
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
      </Loader>
      
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
