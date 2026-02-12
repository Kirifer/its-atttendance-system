import { useCallback, useEffect, useState, useRef } from "react";
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
  const [setDeletingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    timeIn: "",
    lunchOut: "",
    lunchIn: "",
    breakOut: "",
    breakIn: "",
    timeOut: "",
  });

  const token = localStorage.getItem("token");
  const topRef = useRef(null);

  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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

  const loadAttendance = useCallback(async () => {
    if (!selectedUser) return;
    try {
      const res = await axios.get(`/attendance/${selectedUser}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(res.data.attendance || []);
    } catch (err) {
      console.error("Failed loading attendance:", err);
    }
  }, [selectedUser, token]);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

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

  const extractTime = (value) => {
    if (!value) return "";
    const d = new Date(value);
    return d.toISOString().substring(11, 16);
  };

  const resetEditMode = () => {
    setEditingId(null);
    setDate("");
    setForm({
      timeIn: "",
      lunchOut: "",
      lunchIn: "",
      breakOut: "",
      breakIn: "",
      timeOut: "",
    });
    scrollToTop();
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    setDate(record.date?.substring(0, 10) || "");
    setForm({
      timeIn: extractTime(record.timeIn),
      lunchOut: extractTime(record.lunchOut),
      lunchIn: extractTime(record.lunchIn),
      breakOut: extractTime(record.breakOut),
      breakIn: extractTime(record.breakIn),
      timeOut: extractTime(record.timeOut),
    });
    scrollToTop();
  };

  const handleSubmit = async () => {
    if (!selectedUser || !date) {
      alert("Select user and date first.");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await axios.put(
          `/attendance/${editingId}`,
          {
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
        alert("Attendance updated successfully!");
      } else {
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
      }

      resetEditMode();
      loadAttendance();
      scrollToTop();
    } catch (err) {
      console.error(err);
      alert("Failed saving attendance");
    } finally {
      setSaving(false);
    }
  };

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
    <div
      ref={topRef}
      className={`attendance_admin_wrapper ${
        editingId ? "attendance_edit_mode" : ""
      }`}
    >
      <Box
        sx={{ width: "100%", borderBottom: 1, borderColor: "divider", mb: 3 }}
      >
        <Tabs value={0}>
          <Tab label="Create/Edit Attendance" />
        </Tabs>
      </Box>

      <Box sx={{ pt: 2 }}>
        <div className="attendance_admin_top">
          <div>
            <label>User</label>
            <select
              value={selectedUser}
              onChange={(e) => {
                setSelectedUser(e.target.value);
                resetEditMode();
              }}
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
            {Object.keys(form).map((key) => (
              <input
                key={key}
                type="time"
                name={key}
                value={form[key]}
                onChange={handleChange}
              />
            ))}
          </div>
        </div>

        <button
          className="attendance_admin_btn"
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving
            ? editingId
              ? "Updating..."
              : "Saving..."
            : editingId
            ? "Update Attendance"
            : "Save Attendance"}
        </button>

        {editingId && (
          <button
            type="button"
            className="attendance_cancel_btn_full"
            onClick={resetEditMode}
          >
            Cancel Edit
          </button>
        )}

        {selectedUser && (
          <div className="attendance_existing_table">
            <h3>Existing Attendance</h3>

            <table className="attendance_table">
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

                    <td className="attendance_actions_icons">
                      <span
                        className="material-symbols-outlined attendance_edit_icon"
                        onClick={() => handleEdit(r)}
                      >
                        edit
                      </span>

                      <span
                        className="material-symbols-outlined attendance_delete_icon"
                        onClick={() => handleDelete(r.id)}
                      >
                        delete
                      </span>
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
