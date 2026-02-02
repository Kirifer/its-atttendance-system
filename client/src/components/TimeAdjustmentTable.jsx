import { useEffect, useState } from "react";
import API from "../api/api";
import "../styles/TimeAdjustmentTable.css";
import { showToast } from "./Notification/toast";

<link
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
  rel="stylesheet"
/>;

function TimeAdjustmentTable() {
  const [allRequests, setAllRequests] = useState([]);
  const [filterType, setFilterType] = useState("id");
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const typeLabels = {
    change_log: "Change Log Request",
    change_shift: "Change Shift Schedule",
    offset_hours: "Offset Extended Hours",
    overtime: "Overtime",
    undertime: "Undertime",
  };

  const capitalize = (s) => (s ? s.toUpperCase() : "");

  const fetchAllRequests = async () => {
    try {
      const response = await API.get("/time-adjustments", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setAllRequests(response.data.requests || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllRequests();
  }, []);


  const handleUpdateStatus = async (id, status) => {
    if (
      !window.confirm(
        `Are you sure you want to ${status.toLowerCase()} this request?`
      )
    )
      return;

    try {
      await API.put(`/time-adjustments/${id}/status`, { status });

      setAllRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status } : req))
      );

      showToast({
        message: `Request ${status.toLowerCase()} successfully!`,
        type: "success",
        color: "#fff",
      });
    } catch (err) {
      console.error(err);
      showToast({
        message: "Failed to update request",
        type: "error",
        color: "#fff",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?"))
      return;

    try {
      await API.delete(`/time-adjustments/${id}`);
      setAllRequests((prev) => prev.filter((req) => req.id !== id));

      showToast({
        message: "Request deleted successfully!",
        type: "success",
        color: "#fff",
      });
    } catch (err) {
      console.error(err);
      showToast({
        message: "Failed to delete request",
        type: "error",
        color: "#fff",
      });
    }
  };

  // Custom filter request placeholder names
  const placeholderMap = {
    id: "id",
    type: "request type",
    details: "reason",
    user: "username",
    status: "status",
    // creaatedAt: "date submitted",
  };

  const filteredRequests = (allRequests || []).filter((req) => {
    const value =
      filterType === "id"
        ? String(req.id)
        : filterType === "type"
        ? req.type
        : filterType === "details"
        ? req.details
        : filterType === "status"
        ? req.status
        : // : filterType === "createdAt"
        // ? req.createdAt
        filterType === "user" || filterType === "username"
        ? req.user?.username || ""
        : "";

    return value.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div>
      <div className="time-table__search">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="time-table__dropdown"
        >
          <option value="id">ID</option>
          <option value="type">Request Type</option>
          <option value="details">Reason</option>
          <option value="user">Intern Username</option>
          {/* <option value="createdAt">Date Submitted </option> */}
          <option value="status">Status</option>
        </select>

        <input
          type="text"
          placeholder={`Search by ${placeholderMap[filterType]}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="time-table__input"
        />
      </div>

      <div className="time-table-container">
        <table className="time-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Request Type</th>
              <th>Reason</th>
              <th>Intern</th>
              <th>Date Submitted</th>
              <th>Status</th>
              <th>Attachment</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No time adjustment requests yet.
                </td>
              </tr>
            ) : (
              filteredRequests.map((req) => {
                const statusDisplay = capitalize(req.status || "");
                // Attachment Logic
                const fullAttachmentUrl = req.attachment || null;

                return (
                  <tr key={req.id}>
                    <td
                      onClick={() =>
                        setExpandedId(expandedId === req.id ? null : req.id)
                      }
                    >
                      {expandedId === req.id
                        ? req.id
                        : req.id.substring(0, 8) + "..."}
                    </td>
                    <td>
                      <div>
                        <strong>{typeLabels[req.type] || req.type}</strong>

                        {req.type === "change_shift" &&
                          req.shiftDate &&
                          req.startTime &&
                          req.endTime && (
                            <div className="time-table__shift-info">
                              <small>
                                {new Date(req.shiftDate).toLocaleDateString()} <br />
                                {req.startTime} – {req.endTime}
                              </small>
                            </div>
                          )}
                      </div>
                    </td>

                    <td
                      style={{
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        minWidth: "250px",
                        maxWidth: "600px",
                        paddingRight: "12px",
                      }}
                    >
                      {req.details}
                    </td>
                    <td>{req.user?.username || "Unknown"}</td>
                    <td>{new Date(req.createdAt).toLocaleString()}</td>
                    <td
                      className={`time-table__status time-table__status--${req.status.toLowerCase()}`}
                    >
                      {statusDisplay}
                    </td>

                    {/* Attachment Header */}
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

                    {/* Actions Header */}
                    <td className="time-table__actions">

                      <>
                        <span
                          className="material-symbols-outlined time-table__approve"
                          title="Approve"
                          onClick={() => handleUpdateStatus(req.id, "APPROVED")}
                        >
                          check_circle
                        </span>

                        <span
                          className="material-symbols-outlined time-table__reject"
                          title="Reject"
                          onClick={() => handleUpdateStatus(req.id, "REJECTED")}
                        >
                          cancel
                        </span>
                      </>
                      {/* )} */}

                      <span
                        className="material-symbols-outlined time-table__delete"
                        title="Delete"
                        onClick={() => handleDelete(req.id)}
                      >
                        delete
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TimeAdjustmentTable;