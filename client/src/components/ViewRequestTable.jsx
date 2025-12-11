import React, { useState } from "react";
import { showToast } from "./Notification/toast";
import "../styles/ViewRequestTable.css";

function ViewRequestTable({ requests, onStatusChange, onDelete }) {
  const [filterType, setFilterType] = useState("id");
  const [timeAdjustmentQuery, setTimeAdjustmentQuery] = useState("");
  const [timeOffQuery, setTimeOffQuery] = useState("");

  const typeLabels = {
    change_log: "Change Log Request",
    change_shift: "Change Shift Schedule",
    offset_hours: "Offset Extended Hours",
    overtime: "Overtime",
    undertime: "Undertime",
    SICK: "Sick Leave",
    VACATION: "Vacation",
    HOLIDAY: "Holiday",
    OFFSET: "Offset Hours",
  };

  const coverageLabels = {
    FULL_DAY: "Full Day",
    HALF_DAY: "Half Day",
  };

  const timeAdjustmentRawTypes = [
    "change_log",
    "change_shift",
    "offset_hours",
    "overtime",
    "undertime",
  ];

  const timeOffRawTypes = ["SICK", "VACATION", "HOLIDAY", "OFFSET"];

  // Time Adjustment Requests
  const filteredTimeAdjustmentRequests = requests
    .filter((req) => timeAdjustmentRawTypes.includes(req.rawType))
    .filter((req) => {
      const value =
        filterType === "id"
          ? String(req.id)
          : filterType === "type"
          ? req.type
          : filterType === "reason"
          ? req.reason
          : filterType === "coverage"
          ? req.coverage
          : filterType === "status"
          ? req.status
          : filterType === "intern" || filterType === "username"
          ? req.intern || req.user?.username || ""
          : "";
      return value.toLowerCase().includes(timeAdjustmentQuery.toLowerCase());
    });

  // Time Off Requests
  const filteredTimeOffRequests = requests
    .filter((req) => timeOffRawTypes.includes(req.rawType))
    .map((req) => ({
      ...req,
      intern: req.intern || req.user?.username || "N/A",
      displayType: req.type,
      coverage: req.coverage || "-",
      status: (req.status || "").toUpperCase(),
    }))
    .filter((req) => {
      const value =
        filterType === "id"
          ? String(req.id)
          : filterType === "type"
          ? req.displayType
          : filterType === "reason"
          ? req.reason
          : filterType === "coverage"
          ? req.coverage
          : filterType === "status"
          ? req.status
          : filterType === "intern" || filterType === "username"
          ? req.intern
          : "";
      return value.toLowerCase().includes(timeOffQuery.toLowerCase());
    });

  const renderTable = (requestsArray) => (
    <div className="time-table-container">
      <table className="time-table" style={{ tableLayout: "auto" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Reason</th>
            <th>Intern</th>
            <th>Coverage</th>
            <th>Duration</th>
            <th>Status</th>
            <th>Attachment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requestsArray.map((req) => {
            const status = (req.status || "").toUpperCase();

            const fullAttachmentUrl = req.attachment
              ? `${
                  process.env.REACT_APP_BACKEND_URL || "http://localhost:5001"
                }${req.attachment}`
              : null;

            return (
              <tr key={`${req.source}-${req.id}`}>
                <td>{req.id}</td>
                <td>{req.type || req.displayType}</td>
                <td
                  style={{
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    minWidth: "250px",
                    maxWidth: "600px",
                    paddingRight: "12px",
                  }}
                >
                  {req.reason}
                </td>
                <td>{req.intern}</td>
                <td>{req.coverage}</td>
                <td style={{ whiteSpace: "nowrap" }}>{req.duration || "-"}</td>
                <td
                  className={`time-table__status time-table__status--${status.toLowerCase()}`}
                >
                  {status}
                </td>
                <td style={{ whiteSpace: "nowrap" }}>
                  {fullAttachmentUrl ? (
                    <a
                      href={fullAttachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View / Download
                    </a>
                  ) : (
                    "No Attachment"
                  )}
                </td>
                <td className="time-table__actions">
                  {status === "PENDING" && (
                    <>
                      <span
                        className="material-symbols-outlined time-table__approve"
                        onClick={() => {
                          if (!window.confirm("Approve this request?")) return;
                          onStatusChange(req.id, req.source, "APPROVED")
                            .then(() =>
                              showToast({
                                message: "Approved!",
                                type: "success",
                                color: "#fff",
                              })
                            )
                            .catch((err) =>
                              showToast({
                                message: err.message || "Failed",
                                type: "error",
                                color: "#fff",
                              })
                            );
                        }}
                      >
                        check_circle
                      </span>
                      <span
                        className="material-symbols-outlined time-table__reject"
                        onClick={() => {
                          if (!window.confirm("Reject this request?")) return;
                          onStatusChange(req.id, req.source, "REJECTED")
                            .then(() =>
                              showToast({
                                message: "Rejected!",
                                type: "success",
                                color: "#fff",
                              })
                            )
                            .catch((err) =>
                              showToast({
                                message: err.message || "Failed",
                                type: "error",
                                color: "#fff",
                              })
                            );
                        }}
                      >
                        cancel
                      </span>
                    </>
                  )}
                  <span
                    className="material-symbols-outlined time-table__delete"
                    onClick={() => {
                      if (!window.confirm("Delete this request?")) return;
                      onDelete(req.id, req.source)
                        .then(() =>
                          showToast({
                            message: "Deleted!",
                            type: "success",
                            color: "#fff",
                          })
                        )
                        .catch((err) =>
                          showToast({
                            message: err.message || "Failed",
                            type: "error",
                            color: "#fff",
                          })
                        );
                    }}
                  >
                    delete
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="time-requests">
      <h3 className="title_h3">Time Adjustment Requests</h3>
      <div className="time-table__search">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="time-table__dropdown"
        >
          <option value="id">ID</option>
          <option value="type">Type</option>
          <option value="coverage">Coverage</option>
          <option value="reason">Reason</option>
          <option value="intern">Intern</option>
          <option value="status">Status</option>
        </select>
        <input
          type="text"
          placeholder={`Search by ${filterType}...`}
          value={timeAdjustmentQuery}
          onChange={(e) => setTimeAdjustmentQuery(e.target.value)}
          className="time-table__input"
        />
      </div>
      {renderTable(filteredTimeAdjustmentRequests)}

      <h3 className="title_h3">Time Off Requests</h3>
      <div className="time-table__search">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="time-table__dropdown"
        >
          <option value="id">ID</option>
          <option value="type">Type</option>
          <option value="coverage">Coverage</option>
          <option value="reason">Reason</option>
          <option value="intern">Intern</option>
          <option value="status">Status</option>
        </select>
        <input
          type="text"
          placeholder={`Search by ${filterType}...`}
          value={timeOffQuery}
          onChange={(e) => setTimeOffQuery(e.target.value)}
          className="time-table__input"
        />
      </div>
      {renderTable(filteredTimeOffRequests)}
    </div>
  );
}

export default ViewRequestTable;
