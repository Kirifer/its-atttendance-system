import { useEffect } from "react";
import useFilterAttendance from "../hooks/useFilterAttendance";
import "../styles/FilterAttendanceActions.css"

export default function FilterAttendanceActions({
  role,
  firstDay,
  exportPDF,
  filteredRecords,
  onFilterChange, 
}) {
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

  // Whenever filters change, send hook values to AttendanceTable
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
    <div className="attendance_top_bar attendance_top_bar--mobile">
      <div className="attendance_top_bar">
        {/* Search */}
        <div className="leave-table__search" style={{ marginBottom: "10px" }}>
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="leave-table__dropdown"
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
            className="leave-table__input"
          />
        </div>

        {/* Admin only PDF */}
        {role === "ADMIN" && (
          <button
            className="attendance_export_btn"
            onClick={() => exportPDF(filteredRecords)}
          >
            Export
          </button>
        )}

        {/* Filter Controls */}
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
              <option value="Custom">Custom Range</option>
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

          {filterType === "Custom" && (
            <div className="attendance_filter-custom-range">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="attendance_filter_btn"
              />
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="attendance_filter_btn"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}