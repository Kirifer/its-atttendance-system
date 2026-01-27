import "../styles/UserLeaveTable.css";

function UserLeaveTable({
  leaves,
  filterType: leaveFilterType,
  query: leaveQuery,
  setFilterType: setLeaveFilterType,
  setQuery: setLeaveQuery,
}) {
  const leaveTypeLabels = {
    SICK: "Sick Leave",
    VACATION: "Vacation",
    HOLIDAY: "Holiday",
    OFFSET: "Offset Hours",
  };

  const leavePlaceholderMap = {
    leaveType: "request type",
    reason: "reason",
    status: "status",
  };

  const filteredLeaves = leaves.filter((leave) => {
    const value =
      leaveFilterType === "id"
        ? String(leave.id)
        : leaveFilterType === "leaveType"
        ? leave.leaveType
        : leaveFilterType === "reason"
        ? leave.reason
        : leaveFilterType === "coverage"
        ? leave.coverage
        : leaveFilterType === "status"
        ? leave.status
        : "";

    return value.toLowerCase().includes(leaveQuery.toLowerCase());
  });

  return (
    <>
      {/* Search Bar */}
      <div className="user-leave-table__search">
        <select
          value={leaveFilterType}
          onChange={(e) => setLeaveFilterType(e.target.value)}
          className="user-leave-table__dropdown"
        >
          <option value="leaveType">Request Type</option>
          <option value="reason">Reason</option>
          <option value="status">Status</option>
        </select>

        <input
          type="text"
          placeholder={`Search by ${leavePlaceholderMap[leaveFilterType]}...`}
          value={leaveQuery}
          onChange={(e) => setLeaveQuery(e.target.value)}
          className="user-leave-table__input"
        />
      </div>

      {/* Table */}
      {filteredLeaves.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <div className="user-leave-table-container">
          <table className="user-leave-table" style={{ tableLayout: "auto" }}>
            <thead>
              <tr>
                <th>Request Type</th>
                <th style={{ minWidth: "250px" }}>Reason</th>
                <th>Date Submitted</th>
                <th>Status</th>
                <th>Attachment</th>
              </tr>
            </thead>

            <tbody>
              {filteredLeaves.map((leave) => {
                const status = leave.status ? leave.status.toLowerCase() : "";

                const baseHost =
                  process.env.REACT_APP_BACKEND_URL || "http://localhost:5001";

                const cleanBase = baseHost.replace(/\/$/, "");
                const cleanPath = leave.attachment?.startsWith("/")
                  ? leave.attachment
                  : `/${leave.attachment}`;

                const fullAttachmentUrl = leave.attachment?.startsWith("http")
                  ? leave.attachment
                  : leave.attachment
                  ? `${cleanBase}${cleanPath}`
                  : null;

                return (
                  <tr key={leave.id}>
                    <td data-label="Type">
                      {leaveTypeLabels[leave.leaveType] || leave.leaveType}
                    </td>
                    <td
                      data-label="Reason"
                      style={{
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                      }}
                    >
                      {leave.reason}
                    </td>
                    <td data-label="Submitted At">
                      {new Date(leave.createdAt).toLocaleString()}
                    </td>
                    <td
                      data-label="Status"
                      className={`user-leave-table__status user-leave-table__status--${status}`}
                    >
                      {leave.status.toUpperCase()}
                    </td>
                    <td
                      data-label="Attachment"
                      style={{ whiteSpace: "nowrap" }}
                    >
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default UserLeaveTable;
