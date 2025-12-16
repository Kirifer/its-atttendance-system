import { useState, useEffect } from "react";
import { getAllUsers } from "../api/auth";
import "../styles/EditUserSchedule.css";

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
        if (allUsers.length > 0) setSelectedUserId(allUsers[0].id);
      } catch (err) {
        console.warn("Fetching users skipped for non-admin", err.message);
      }
    };
    fetchUsers();
  }, [user]);

  if (!showSchedule) return null;

  const handleSave = async () => {
    if (!selectedUserId || !date) {
      alert("Please select user and date");
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

  return (
    <div className="custom_schedule_overlay">
      <div className="custom_schedule">
        <h2>Configure Custom Schedule</h2>
        <label>User Email</label>
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.email}
            </option>
          ))}
        </select>

        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        <label>Time In</label>
        <input type="time" value={timeIn} onChange={(e) => setTimeIn(e.target.value)} />

        <label>Time Out</label>
        <input type="time" value={timeOut} onChange={(e) => setTimeOut(e.target.value)} />

        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

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
