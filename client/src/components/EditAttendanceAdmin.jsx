import React, { useEffect, useState } from "react";
import axios from "../api/api";
import "../styles/AttendanceTable.css";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import "../styles/EditAttendanceAdmin.css";

function EditAttendanceAdmin() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [date, setDate] = useState("");
  const [records, setRecords] = useState([]);
  const [deletingId, setDeletingId] = useState(null); // ✅ NEW
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    timeIn: "",
    lunchOut: "",
    lunchIn: "",
    breakOut: "",
    breakIn: "",
    timeOut: "",
  });

  const token = localStorage.getItem("token");

  // ================= LOAD USERS =================
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/admins/all-users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(res.data.users || []);
      } catch (err) {
        console.error("Failed loading users:", err);
      }
    };

    fetchUsers();
  }, [token]);

  // ================= LOAD ATTENDANCE =================
  const loadAttendance = async () => {
    if (!selectedUser) return;

    try {
      const res = await axios.get(`/attendance/${selectedUser}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRecords(res.data.attendance || []);
    } catch (err) {
      console.error("Failed loading attendance:", err);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, [selectedUser]);

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const buildDateTime = (timeValue) => {
    if (!timeValue || !date) return null;
    return `${date}T${timeValue}`;
  };

  // ================= SAVE =================
  const handleSubmit = async () => {
    if (!selectedUser || !date) {
      alert("Select user and date first.");
      return;
    }

    try {
      setSaving(true);

      await axios.post(
        "/attendance/admin-create",
        {
          userId: selectedUser,
          date,
          timeIn: buildDateTime(form.timeIn),
          lunchOut: buildDateTime(form.lunchOut),
          lunchIn: buildDateTime(form.lunchIn),
          breakOut: buildDateTime(form.breakOut),
          breakIn: buildDateTime(form.breakIn),
          timeOut: buildDateTime(form.timeOut),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      alert("Attendance saved successfully!");

      setForm({
        timeIn: "",
        lunchOut: "",
        lunchIn: "",
        breakOut: "",
        breakIn: "",
        timeOut: "",
      });
      setDate("");

      loadAttendance();
    } catch (err) {
      console.error(err);
      alert("Failed saving attendance");
    } finally {
      setSaving(false);
    }
  };

  // ================= DELETE (IMPROVED) =================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this attendance record?",
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      await axios.delete(`/attendance/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      loadAttendance();
    } catch (err) {
      console.error(err);
      alert("Failed deleting attendance");
    } finally {
      setDeletingId(null);
    }
  };

  // ================= FORMAT =================
  const formatTime = (value) =>
    value
      ? new Date(value).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";

  const formatDate = (value) =>
    value ? new Date(value).toLocaleDateString() : "-";

  return (
    <div className="attendance_admin_wrapper">
      <Box
        sx={{ width: "100%", borderBottom: 1, borderColor: "divider", mb: 3 }}
      >
        <Tabs value={0} aria-label="Edit Attendance Tabs">
          <Tab label="Create/Edit Attendance" />
        </Tabs>
      </Box>

      <Box sx={{ pt: 2 }}>
        {/* USER + DATE */}
        <div className="attendance_admin_top">
          <div>
            <label>User</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">Select user</option>
              {users
                .filter((u) => u.role === "USER")
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username} ({u.email})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* EDIT INPUTS */}
        <div className="attendance_admin_table">
          <div className="attendance_admin_header">
            <span>Time In</span>
            <span>Lunch Out</span>
            <span>Lunch In</span>
            <span>Break Out</span>
            <span>Break In</span>
            <span>Time Out</span>
          </div>

          <div className="attendance_admin_inputs">
            <input
              type="time"
              name="timeIn"
              value={form.timeIn}
              onChange={handleChange}
            />
            <input
              type="time"
              name="lunchOut"
              value={form.lunchOut}
              onChange={handleChange}
            />
            <input
              type="time"
              name="lunchIn"
              value={form.lunchIn}
              onChange={handleChange}
            />
            <input
              type="time"
              name="breakOut"
              value={form.breakOut}
              onChange={handleChange}
            />
            <input
              type="time"
              name="breakIn"
              value={form.breakIn}
              onChange={handleChange}
            />
            <input
              type="time"
              name="timeOut"
              value={form.timeOut}
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          className="attendance_admin_btn"
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Attendance"}
        </button>

        {/* ===== EXISTING ATTENDANCE ===== */}
        {selectedUser && (
          <div className="attendance_existing_table">
            <h3>Existing Attendance</h3>

            <table className="attendance_table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Time In</th>
                  <th>Lunch Out</th>
                  <th>Lunch In</th>
                  <th>Break Out</th>
                  <th>Break In</th>
                  <th>Time Out</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {records.map((r) => (
                  <tr key={r.id}>
                    <td>{r.status}</td>
                    <td>{formatDate(r.date)}</td>
                    <td>{formatTime(r.timeIn)}</td>
                    <td>{formatTime(r.lunchOut)}</td>
                    <td>{formatTime(r.lunchIn)}</td>
                    <td>{formatTime(r.breakOut)}</td>
                    <td>{formatTime(r.breakIn)}</td>
                    <td>{formatTime(r.timeOut)}</td>
                    <td>
                      <button
                        className="attendance_delete_btn"
                        disabled={deletingId === r.id}
                        onClick={() => handleDelete(r.id)}
                      >
                        {deletingId === r.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Box>
    </div>
  );
}

export default EditAttendanceAdmin;
