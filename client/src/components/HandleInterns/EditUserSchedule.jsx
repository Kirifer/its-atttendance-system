import { useState, useEffect } from "react";
import { getAllUsers } from "../../api/auth";
import "../../styles/HandleInterns/EditUserSchedule.css";

export default function EditUserSchedule({ userSchedule, user }) {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [timeIn, setTimeIn] = useState("09:00");
  const [timeOut, setTimeOut] = useState("18:00");
  const [date, setDate] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    showSchedule,
    closeSchedule,
    setSchedule,
    loading,
    error,
  } = userSchedule;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (user.role !== "ADMIN") return;
        const allUsers = await getAllUsers();
        setUsers(allUsers);
        setSelectedUserId(""); // start empty
      } catch (err) {
        console.warn("Fetching users skipped for non-admin", err.message);
      }
    };
    fetchUsers();
  }, [user]);

  if (!showSchedule) return null;

  const handleSave = async () => {
    if (!selectedUserId || !date) {
      alert("Please select user(s) and date");
      return;
    }

    const result = await setSchedule({
      userId: selectedUserId, 
      startTime: timeIn,
      endTime: timeOut,
      date,
    });

    if (result) {
      setSuccessMessage("Schedule saved successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        closeSchedule();
      }, 1500);
    }
  };

  // helper for checkbox logic
  const selectedIds =
    selectedUserId && selectedUserId !== "ALL"
      ? selectedUserId.split(",")
      : [];

  return (
    <div className="custom_schedule_overlay">
      <div className="custom_schedule">
        <h2>Configure Custom Schedule</h2>

        {/* USER SELECTION */}
        <label>Select Users</label>
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

                  if (e.target.checked) {
                    newIds.push(u.id);
                  } else {
                    newIds = newIds.filter(id => id !== u.id);
                  }

                  setSelectedUserId(newIds.join(","));
                }}
              />
              {u.email}
            </label>
          ))}
        </div>

        {/* DATE */}
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {/* TIME IN */}
        <label>Time In</label>
        <input
          type="time"
          value={timeIn}
          onChange={(e) => setTimeIn(e.target.value)}
        />

        {/* TIME OUT */}
        <label>Time Out</label>
        <input
          type="time"
          value={timeOut}
          onChange={(e) => setTimeOut(e.target.value)}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMessage && (
          <p style={{ color: "green" }}>{successMessage}</p>
        )}

        <div className="custom_schedule_buttons">
          <button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button onClick={closeSchedule}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
