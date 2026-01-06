import { useEffect, useState } from "react";
import { getAllUsers } from "../../api/auth";
import "../../styles/HandleInterns/EditUserScheduleDesktop.css";

export default function EditUserScheduleDesktop({ userSchedule, user }) {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [date, setDate] = useState("");
  const [timeIn, setTimeIn] = useState("09:00");
  const [timeOut, setTimeOut] = useState("18:00");
  const [successMessage, setSuccessMessage] = useState("");

  const { setSchedule, loading, error } = userSchedule;


  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (user.role !== "ADMIN") return;

      try {
        const allUsers = await getAllUsers();
        setUsers(allUsers);
      } catch (err) {
        console.warn("Failed to load users", err);
      }
    };

    fetchUsers();
  }, [user]);

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
      {successMessage && <p className="schedule_success">{successMessage}</p>}

      <div className="schedule_horizontal_group">
        {/* USER */}
        <div className="schedule_field">
          <label>User Email</label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            {/* Placeholder message */}
            <option value="" disabled>
              Select a user
            </option>
          
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.email}
              </option>
            ))}
          </select>
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
