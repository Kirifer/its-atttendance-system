import { useEffect, useState } from "react";
import useFilterAttendance from "../hooks/useFilterAttendance";
import "../styles/FilterAttendanceActionsMobile.css";

export default function FilterAttendanceActionsMobile({
  role,
  firstDay,
  exportPDF,
  filteredRecords,
  onFilterChange,
}) {
  const [open, setOpen] = useState(false);

  const {
    filterType,
    setFilterType,
    filterWeek,
    setFilterWeek,
    searchField,
    setSearchField,
    query,
    setQuery,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    getTotalWeeksInMonth,
  } = useFilterAttendance();

  // keep original filtering behavior
  useEffect(() => {
    onFilterChange({
      filterType,
      filterWeek,
      searchField,
      query,
      customStart,
      customEnd,
    });
  }, [
    filterType,
    filterWeek,
    searchField,
    query,
    customStart,
    customEnd,
    onFilterChange,
  ]);

  return (
    <div className="attendance_top_bar">
      {/* MOBILE FILTER BUTTON */}
      <button
        className="attendance_mobile_filter_btn"
        onClick={() => setOpen(true)}
      >
        Filter
      </button>

      {/* ADMIN EXPORT (still accessible) */}
      {role === "ADMIN" && (
        <button
          className="attendance_export_btn"
          onClick={() => exportPDF(filteredRecords)}
        >
          Export
        </button>
      )}

      {/* MODAL */}
      {open && (
        <div
          className="attendance_filter_overlay"
          onClick={() => setOpen(false)}
        >
          <div
            className="attendance_filter_modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Filter Attendance</h2>

            {/* SEARCH */}
            <label>Search By</label>
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
            >
              <option value="id">ID</option>
              <option value="Intern">Username</option>
              <option value="Status">Status</option>
              <option value="Date">Date</option>
            </select>

            <input
              type="text"
              placeholder={`Search by ${searchField}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {/* FILTER TYPE */}
            <label>Filter Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="Month">Month</option>
              <option value="Week">Week</option>
              <option value="Custom">Custom Range</option>
            </select>

            {/* WEEK */}
            {filterType === "Week" && (
              <>
                <label>Week</label>
                <select
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
              </>
            )}

            {/* CUSTOM RANGE */}
            {filterType === "Custom" && (
              <>
                <label>Start Date</label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                />

                <label>End Date</label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                />
              </>
            )}

            {/* ACTIONS */}
            <div className="attendance_filter_actions">
              <button onClick={() => setOpen(false)}>Apply</button>
              <button onClick={() => setOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}