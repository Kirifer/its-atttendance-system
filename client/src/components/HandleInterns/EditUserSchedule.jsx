import { useState, useEffect, useMemo, useRef } from "react";
import { getAllUsers } from "../../api/auth";
import "../../styles/HandleInterns/EditUserSchedule.css";

export default function EditUserSchedule({ userSchedule, user }) {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [date, setDate] = useState("");
  const [timeIn, setTimeIn] = useState("09:00");
  const [timeOut, setTimeOut] = useState("18:00");
  const [successMessage, setSuccessMessage] = useState("");

  const [showUsers, setShowUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const { showSchedule, closeSchedule, setSchedule, loading, error } =
    userSchedule;

  useEffect(() => {
    const fetchUsers = async () => {
      if (user.role !== "ADMIN") return;
      try {
        const response = await getAllUsers();
        const usersArray = response?.users || response || [];
        setUsers(usersArray);
        setSelectedUserId("");
      } catch (err) {
        console.warn("Failed to load users", err);
        setUsers([]);
      }
    };
    fetchUsers();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUsers(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedIds = useMemo(
    () =>
      selectedUserId && selectedUserId !== "ALL"
        ? selectedUserId.split(",")
        : [],
    [selectedUserId],
  );

  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedIds.includes(u.id),
    );
  }, [users, searchTerm, selectedIds]);

  const handleSelectUser = (id) => {
    if (selectedUserId === "ALL") return;
    const newIds = [...selectedIds, id];
    setSelectedUserId(newIds.join(","));
    setSearchTerm("");
    setShowUsers(false);
  };

  const handleContainerClick = () => {
    if (selectedUserId === "ALL") return;
    inputRef.current?.focus();
    setShowUsers(true);
  };

  const handleRemoveUser = (id) => {
    const newIds = selectedIds.filter((selectedId) => selectedId !== id);
    setSelectedUserId(newIds.join(","));
  };

  const handleSave = async () => {
    if (!selectedUserId || !date) return;
    const ok = await setSchedule({
      userId: selectedUserId,
      startTime: timeIn,
      endTime: timeOut,
      date: date,
    });
    if (ok) {
      setSuccessMessage("Schedule saved successfully");

      setSelectedUserId("");
      setSearchTerm("");

      setTimeout(() => {
        setSuccessMessage("");
        closeSchedule();
      }, 2000);
    }
  };

  if (!showSchedule) return null;

  return (
    <div className="custom_schedule_overlay">
      <div className="custom_schedule">
        <h2>Set Custom Schedule</h2>

        {error && <p className="schedule_error">{error}</p>}
        {successMessage && <p className="schedule_success">{successMessage}</p>}

        {/* USER SELECTION */}
        <div className="schedule_field user_list_wrapper" ref={dropdownRef}>
          <label className="field_label">Select Users</label>

          <div
            className={`user_chip_container ${selectedUserId === "ALL" ? "locked" : ""}`}
            onClick={handleContainerClick}
          >
            {selectedUserId === "ALL" ? (
              <div className="user_chip all_chip">
                ALL USERS
                <button type="button" onClick={() => setSelectedUserId("")}>
                  &times;
                </button>
              </div>
            ) : (
              selectedIds.map((id) => {
                const u = users.find((user) => user.id === id);
                return (
                  <div key={id} className="user_chip">
                    {u?.email}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveUser(id);
                      }}
                    >
                      &times;
                    </button>
                  </div>
                );
              })
            )}

            <input
              ref={inputRef}
              type="text"
              className="user_search_input"
              readOnly={selectedUserId === "ALL"}
              tabIndex={selectedUserId === "ALL" ? -1 : 0}
              placeholder={
                selectedIds.length === 0 && selectedUserId !== "ALL"
                  ? "Search emails..."
                  : ""
              }
              value={searchTerm}
              onChange={(e) => {
                if (selectedUserId !== "ALL") {
                  setSearchTerm(e.target.value);
                  setShowUsers(true);
                }
              }}
            />
          </div>

          {selectedUserId !== "ALL" && showUsers && (
            <div className="user_dropdown">
              <div
                className="user_dropdown_item all_option"
                onClick={() => {
                  setSelectedUserId("ALL");
                  setSearchTerm("");
                  setShowUsers(false);
                }}
              >
                <strong>ALL USERS</strong>
              </div>

              {filteredUsers.map((u) => (
                <div
                  key={u.id}
                  className="user_dropdown_item"
                  onClick={() => handleSelectUser(u.id)}
                >
                  {u.email}
                </div>
              ))}

              {filteredUsers.length === 0 && (
                <div className="user_no_results">
                  No users found for "{searchTerm}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* DATE */}
        <div className="schedule_field">
          <label className="field_label">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* TIME IN */}
        <div className="schedule_field">
          <label className="field_label">Time In</label>
          <input
            type="time"
            value={timeIn}
            onChange={(e) => setTimeIn(e.target.value)}
          />
        </div>

        {/* TIME OUT */}
        <div className="schedule_field">
          <label className="field_label">Time Out</label>
          <input
            type="time"
            value={timeOut}
            onChange={(e) => setTimeOut(e.target.value)}
          />
        </div>

        <div className="custom_schedule_buttons">
          <button
            onClick={handleSave}
            disabled={loading || !selectedUserId || !date}
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button onClick={closeSchedule}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
