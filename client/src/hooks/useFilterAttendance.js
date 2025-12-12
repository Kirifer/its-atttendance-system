import { useState } from "react";

export default function useFilterAttendance() {
  const [filterType, setFilterType] = useState("Month");
  const [filterWeek, setFilterWeek] = useState(1);

  const [searchField, setSearchField] = useState("Intern");
  const [query, setQuery] = useState("");

  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

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

  return {
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

    getWeekOfMonth,
    getTotalWeeksInMonth,
  };
}
