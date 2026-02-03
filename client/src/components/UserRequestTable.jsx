import "../styles/UserRequestTable.css";

function UserRequestsTable({
  requests,
  filterType,
  query,
  setFilterType,
  setQuery,
}) {
  const typeLabels = {
    change_log: "Change Log Request",
    change_shift: "Change Shift Schedule",
    offset_hours: "Offset Extended Hours",
    overtime: "Overtime",
    undertime: "Undertime",
  };

  const placeholderMap = {
    type: "request type",
    details: "reason",
    status: "status",
  };

  const filteredRequests = requests.filter((req) => {
    const value =
      filterType === "type"
        ? req.type
        : filterType === "details"
          ? req.details
          : filterType === "status"
            ? req.status
            : "";
    return value.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <>
      {/* Search Bar */}
      <div className="user-time-table__search">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="user-time-table__dropdown"
        >
          <option value="type">Request Type</option>
          <option value="details">Reason</option>
          <option value="status">Status</option>
        </select>

        <input
          type="text"
          placeholder={`Search by ${placeholderMap[filterType]}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="user-time-table__input"
        />
      </div>
      {/* Table */}
      {filteredRequests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <div className="user-time-table-container">
          <table className="user-time-table" style={{ tableLayout: "auto" }}>
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
              {filteredRequests.map((req) => {
                const status = req.status ? req.status.toLowerCase() : "";

                const isExternal = req.attachment?.startsWith("http");

                const baseHost =
                  process.env.REACT_APP_BACKEND_URL || "http://localhost:5001";

                const cleanBase = baseHost.replace(/\/$/, "");
                const cleanPath = req.attachment?.startsWith("/")
                  ? req.attachment
                  : `/${req.attachment}`;

                const fullAttachmentUrl = req.attachment
                  ? isExternal
                    ? req.attachment
                    : `${cleanBase}${cleanPath}`
                  : null;

                return (
                  <tr key={req.id}>
                    <td data-label="Type">
                      {typeLabels[req.type] || req.type}
                    </td>
                    <td
                      data-label="Details"
                      style={{
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                      }}
                    >
                      {req.details}
                    </td>
                    <td data-label="Submitted At">
                      {new Date(req.createdAt).toLocaleString()}
                    </td>
                    <td
                      data-label="Status"
                      className={`user-time-table__status user-time-table__status--${status}`}
                    >
                      {req.status.toUpperCase()}
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

export default UserRequestsTable;
