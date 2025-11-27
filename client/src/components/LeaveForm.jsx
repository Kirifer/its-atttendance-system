import { useState } from "react";
import "../styles/LeaveForm.css"
import { showToast } from "./Notification/toast";

function LeaveForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    leaveType: "PERSONAL",
    reason: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await onSubmit(formData);

    showToast({
      message: "Leave submitted successfully!",
      icon: "✔️",
      color: "#4caf50", // green
    });

    setFormData({
      startDate: "",
      endDate: "",
      leaveType: "PERSONAL",
      reason: "",
    });
  } catch (err) {
    showToast({
      message: err.message || "Error submitting leave",
      icon: "❌",
      color: "#d9534f", // red
    });
  }
};

  return (
    <form className="leave-form" onSubmit={handleSubmit}>
      {error && <p className="leave-form__error">{error}</p>}
      {success && <p className="leave-form__success">{success}</p>}

      <div className="row">
        <label>
          Leave Type:
          <select
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
          >
            <option value="SICK">SICK</option>
            <option value="VACATION">VACATION</option>
            <option value="PERSONAL">PERSONAL</option>
          </select>
        </label>
      </div>

      <div className="row date-row">
        <label>
          Start Date:
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <div className="row">
        <label>
          Reason For Leave
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div className="submit-btn-container">
        <button type="submit">Submit Leave</button>
      </div>
    </form>
  );
}

export default LeaveForm;
