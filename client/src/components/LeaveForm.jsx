import { useState } from "react";

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
    setError("");
    setSuccess("");
    try {
      await onSubmit(formData);
      setSuccess("Leave submitted successfully!");
      setFormData({ startDate: "", endDate: "", leaveType: "PERSONAL", reason: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "0 auto" }}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <label>
        Start Date:
        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
      </label>

      <label>
        End Date:
        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
      </label>

      <label>
        Leave Type:
        <select name="leaveType" value={formData.leaveType} onChange={handleChange}>
          <option value="SICK">SICK</option>
          <option value="VACATION">VACATION</option>
          <option value="PERSONAL">PERSONAL</option>
        </select>
      </label>

      <label>
        Reason:
        <textarea name="reason" value={formData.reason} onChange={handleChange} required />
      </label>

      <button type="submit">Submit Leave</button>
    </form>
  );
}

export default LeaveForm;
