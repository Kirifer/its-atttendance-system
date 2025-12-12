import { useState, useEffect } from "react";
import useUserSchedule from "../hooks/useUserSchedule";
import { getAllUsers } from "../api/auth";

export default function EditUserSchedulePopup({ 
  onClose = () => {},
  onSave = () => {},
}) {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [timeIn, setTimeIn] = useState("09:00");
  const [timeOut, setTimeOut] = useState("18:00");
  const [date, setDate] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // <-- success message state

  const { setSchedule, loading, error } = useUserSchedule();

  // Fetch all users for selection
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        setUsers(allUsers);
        if (allUsers.length > 0) setSelectedUserId(allUsers[0].id);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleSave = async () => {
    if (!selectedUserId) {
      alert("Please select a user");
      return;
    }

    if (!date) {
      alert("Please select a date for the schedule");
      return;
    }

    try {
      const result = await setSchedule({
        userId: selectedUserId,
        startTime: timeIn,
        endTime: timeOut,
        date,
      });

      if (result) {
        setSuccessMessage("Schedule saved successfully!"); // <-- show success
        onSave?.();

        // Optionally close the popup after a short delay
        setTimeout(() => {
          setSuccessMessage("");
          onClose();
        }, 2000);
      } else {
        alert(error || "Failed to save schedule");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Set User Schedule</h2>

      <div>
        <label>User Email:</label>
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
      </div>

      <div>
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div>
        <label>Time In:</label>
        <input
          type="time"
          value={timeIn}
          onChange={(e) => setTimeIn(e.target.value)}
        />
      </div>

      <div>
        <label>Time Out:</label>
        <input
          type="time"
          value={timeOut}
          onChange={(e) => setTimeOut(e.target.value)}
        />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>} {/* <-- display success */}

      <div>
        <button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}
