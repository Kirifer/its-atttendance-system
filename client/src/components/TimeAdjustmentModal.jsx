import React, { use, useEffect, useState } from "react";
import "../styles/TimeAdjustmentModal.css";
import API from "../api/api";
import { showToast } from "./Notification/toast";

const TimeAdjustmentModal = ({ isOpen, onClose, refreshRequests }) => {
  const [type, setType] = useState("");
  const [details, setDetails] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!type || !details) {
      alert("Please select type and provide details.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("details", details);
      if (attachment) formData.append("attachment", attachment);

      await API.post("/time-adjustments", formData);

      showToast({
        message: "Request submitted successfully!",
        type: "success",
        color: "#ffffff",
      });

      setType("");
      setDetails("");
      setAttachment(null);
      onClose();

      if (refreshRequests) {
        refreshRequests();
      }
    } catch (err) {
      showToast({
        message: "Failed to submit request.",
        type: "error",
        color: "#ffffff",
      });
      console.log(err);
    }
  };

  return (
    <div className={`modal-overlay ${isAnimating ? "show" : ""}`}>
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

          {/* Attachment */}
          <label>
            Attachment (optional)
            <input
              type="file"
              onChange={(e) => setAttachment(e.target.files[0])}
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
