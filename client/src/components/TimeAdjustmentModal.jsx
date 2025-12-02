import React, { useState } from "react";
import "../styles/TimeAdjustmentModal.css";
import API from "../api/api";

const TimeAdjustmentModal = ({ isOpen, onClose }) => {
  const [type, setType] = useState("");
  const [details, setDetails] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type || !details) {
      alert("Please select type and provide details.");
      return;
    }

    try {
      const res = await API.post("/time-adjustments", { type, details });
      alert("Request submitted successfully!");
      onClose();
      setType("");
      setDetails("");
    } catch (error) {
      alert("Failed to submit request.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>File Time Adjustment Request</h2>
        <form onSubmit={handleSubmit}>
          <label>Type of Adjustment</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="change_log">Change Log Request</option>
            <option value="change_shift">Change Shift Schedule</option>
            <option value="offset_hours">Offset Extended Hours</option>
            <option value="overtime">Overtime</option>
            <option value="undertime">Undertime</option>
          </select>

          <label>
            Details / Reason
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide details for your request"
            />
          </label>

          <div className="modal-actions">
            <button type="submit">Submit Request</button>
            <button onClick={onClose}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimeAdjustmentModal;
