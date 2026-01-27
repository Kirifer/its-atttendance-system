import { useState } from "react";
import "../styles/LeaveForm.css";
import { showToast } from "./Notification/toast";

function LeaveForm({ onSubmit }) {
  const initialFormData = {
    startDate: "",
    endDate: "",
    leaveType: "OFFSET",
    leaveCoverage: "FULL_DAY",
    reason: "",
    attachment: null, // new field for file
  };

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "attachment") {
      setFormData((prev) => ({ ...prev, attachment: files[0] || null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    // Validate that start and end dates are in the future
    if (startDate <= today || endDate <= today) {
      setError("Leave dates must be in the future.");
      setSuccess("");
      return;
    }

    // Validate leave type
    const validTypes = ["SICK", "VACATION", "HOLIDAY", "OFFSET"];
    if (!validTypes.includes(formData.leaveType)) {
      setError("Invalid leave type selected");
      setSuccess("");
      return;
    }

    if (formData.attachment) {
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
      ];

      if (!allowedTypes.includes(formData.attachment.type)) {
        setError("Attachment must be a PDF or an image file.");
        setSuccess("");
        return;
      }
    }

    try {
      // Create FormData
      const submissionData = new FormData();
      submissionData.append("startDate", formData.startDate);
      submissionData.append("endDate", formData.endDate);
      submissionData.append("leaveType", formData.leaveType);
      submissionData.append("coverage", formData.leaveCoverage);
      submissionData.append("reason", formData.reason || "");
      if (formData.attachment) {
        submissionData.append("attachment", formData.attachment);
      }

      // Call API
      await onSubmit(submissionData);

      showToast({
        message: "Leave submitted successfully!",
        color: "#ffffff",
        type: "success",
      });

      setFormData(initialFormData);
      setError("");
      setSuccess("Leave submitted successfully!");
    } catch (err) {
      showToast({
        message: err.message || "Error submitting leave",
        color: "#ffffff",
        type: "error",
      });
      setError(err.message || "Error submitting leave");
      setSuccess("");
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
            <option value="HOLIDAY">HOLIDAY</option>
            <option value="OFFSET">OFFSET</option>
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
            min={
              new Date(new Date().setDate(new Date().getDate() + 1))
                .toISOString()
                .split("T")[0]
            } // tomorrow's date
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
            min={
              new Date(new Date().setDate(new Date().getDate() + 1))
                .toISOString()
                .split("T")[0]
            } // tomorrow's date
          />
        </label>
      </div>

      <div className="row">
        <label>
          Leave Coverage:
          <select
            name="leaveCoverage"
            value={formData.leaveCoverage}
            onChange={handleChange}
            required
          >
            <option value="FULL_DAY">Full Day</option>
            <option value="HALF_DAY">Half Day</option>
          </select>
        </label>
      </div>

      <div className="row">
        <label>
          Reason For Leave (optional):
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <div className="row">
        <label>
          Attachment (required):
          <input
            type="file"
            name="attachment"
            accept=".pdf,image/*"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                attachment: e.target.files[0],
              }))
            }
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
