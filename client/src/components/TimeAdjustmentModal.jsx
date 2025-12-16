import { useEffect, useState } from "react";
import "../styles/TimeAdjustmentModal.css";
import API from "../api/api";
import { showToast } from "./Notification/toast";

const TimeAdjustmentModal = ({ isOpen, onClose, refreshRequests }) => {
  const [type, setType] = useState("");
  const [details, setDetails] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [shiftDate, setShiftDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      requestAnimationFrame(() => setIsAnimating(true));
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

    if (type === "change_shift" && (!shiftDate || !startTime || !endTime)) {
      alert("Please provide shift date, time in, and time out.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("details", details);

      if (type === "change_shift") {
        formData.append("shiftDate", shiftDate);
        formData.append("startTime", startTime);
        formData.append("endTime", endTime);
      }

      if (attachment) {
        formData.append("attachment", attachment);
      }

      await API.post("/time-adjustments", formData);

      showToast({ message: "Request submitted successfully!", type: "success" });

      setType("");
      setDetails("");
      setAttachment(null);
      setShiftDate("");
      setStartTime("");
      setEndTime("");

      onClose();
      refreshRequests?.();
    } catch (err) {
      showToast({ message: "Failed to submit request.", type: "error" });
      console.error(err);
    }
  };

  return (
    <div className={`modal-overlay ${isAnimating ? "show" : ""}`}>
      <div className="modal-content">
        <h2>Time Adjustment Request</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Select type</option>
              <option value="change_log">Change Log</option>
              <option value="change_shift">Change Shift</option>
              <option value="offset_hours">Offset Hours</option>
              <option value="overtime">Overtime</option>
              <option value="undertime">Undertime</option>
            </select>
          </div>

          {type === "change_shift" && (
            <div className="grid-2">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={shiftDate}
                  onChange={(e) => setShiftDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Time In</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Time Out</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Details</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Explain your request..."
            />
          </div>

          <div className="form-group">
            <label>Attachment (optional)</label>
            <input type="file" onChange={(e) => setAttachment(e.target.files[0])} />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimeAdjustmentModal;
