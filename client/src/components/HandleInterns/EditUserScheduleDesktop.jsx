import { useEffect, useState } from "react";
import { getAllUsers } from "../../api/auth";
import "../../styles/HandleInterns/EditUserScheduleDesktop.css";

export default function EditUserScheduleDesktop({ userSchedule, user }) {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [date, setDate] = useState("");
  const [timeIn, setTimeIn] = useState("09:00");
  const [timeOut, setTimeOut] = useState("18:00");
  const [successMessage, setSuccessMessage] = useState("");

  // NEW: toggle state
  const [showUsers, setShowUsers] = useState(false);

  const { setSchedule, loading, error } = userSchedule;

  useEffect(() => {
    const fetchUsers = async () => {
      if (user.role !== "ADMIN") return;

      try {
        const allUsers = await getAllUsers();
        setUsers(allUsers);
        setSelectedUserId("");
      } catch (err) {
        console.warn("Failed to load users", err);
      }
    };

    fetchUsers();
  }, [user]);

  const selectedIds =
    selectedUserId && selectedUserId !== "ALL"
      ? selectedUserId.split(",")
      : [];

  const selectedSummary =
    selectedUserId === "ALL"
      ? "ALL USERS"
      : selectedIds.length
      ? `${selectedIds.length} selected`
      : "None selected";

  const handleSave = async () => {
    if (!selectedUserId || !date) return;

    const ok = await setSchedule({
      userId: selectedUserId,
      startTime: timeIn,
      endTime: timeOut,
      date,
    });

    if (ok) {
      setSuccessMessage("Schedule saved successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  return (
    <div className="schedule_desktop_container">
      <h2 className="schedule_title">Set Custom Schedule</h2>

      {error && <p className="schedule_error">{error}</p>}
      {successMessage && (
        <p className="schedule_success">{successMessage}</p>
      )}

      <div className="schedule_horizontal_group">
        {/* USERS */}
        <div className="schedule_field user_list">
          <label className="user_select_header">
            Select Users
            <button
              type="button"
              className="user_toggle_btn"
              onClick={() => setShowUsers(prev => !prev)}
            >
              {showUsers ? "Hide" : "Show"}
            </button>
          </label>

          <div className="user_select_summary">
            {selectedSummary}
          </div>

          {showUsers && (
            <div className="user-select-box">
              <label className="user-select-item">
                <input
                  type="checkbox"
                  checked={selectedUserId === "ALL"}
                  onChange={(e) =>
                    setSelectedUserId(e.target.checked ? "ALL" : "")
                  }
                />
                <strong>ALL USERS</strong>
              </label>

              <hr />

              {users.map((u) => (
                <label key={u.id} className="user-select-item">
                  <input
                    type="checkbox"
                    disabled={selectedUserId === "ALL"}
                    checked={selectedIds.includes(u.id)}
                    onChange={(e) => {
                      let newIds = [...selectedIds];

                      if (e.target.checked) newIds.push(u.id);
                      else newIds = newIds.filter(id => id !== u.id);

                      setSelectedUserId(newIds.join(","));
                    }}
                  />
                  {u.email}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* DATE */}
        <div className="schedule_field">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* TIME IN */}
        <div className="schedule_field">
          <label>Time In</label>
          <input
            type="time"
            value={timeIn}
            onChange={(e) => setTimeIn(e.target.value)}
          />
        </div>

        {/* TIME OUT */}
        <div className="schedule_field">
          <label>Time Out</label>
          <input
            type="time"
            value={timeOut}
            onChange={(e) => setTimeOut(e.target.value)}
          />
        </div>

        {/* SAVE */}
        <div className="schedule_field action">
          <label>&nbsp;</label>
          <button
            className="schedule_save_btn"
            onClick={handleSave}
            disabled={loading || !selectedUserId || !date}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
