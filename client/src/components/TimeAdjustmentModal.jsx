import React, { useState } from "react";
import "../styles/TimeAdjustmentModal.css";
import API from "../api/api";

const TimeAdjustmentModal = ({ isOpen, onClose, refreshRequests }) => {
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
      await API.post(
        "/time-adjustments",
        { type, details },
        { headers: { "Content-Type": "application/json" } }
      );
      alert("Request submitted successfully!");
      setType("");
      setDetails("");
      onClose();

      if (refreshRequests) {
        refreshRequests();
      }
    } catch (err) {
      alert("Failed to submit request.");
      console.log(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>File Time Adjustment Request</h2>

        <form onSubmit={handleSubmit}>
          <label>Type of Adjustment</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">-- Select Type --</option>
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
            <button type="button" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimeAdjustmentModal;
