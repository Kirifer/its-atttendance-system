import { Link } from "react-router-dom";
import useHandleOjtHours from "../hooks/handleOjtHours";

export default function SetOjtHours() {
  const {
    search,
    setSearch,
    filteredUsers,
    selectUser,
    selectedUser,
    totalOJTHours,
    setTotalOJTHours,
    remainingWorkHours,
    saveOjtHours,
    loading,
    error,
  } = useHandleOjtHours();

  return (
    <div className="ojt-container">
      <Link to="/intern-hours">
        <button className="primary-btn">
          Set / View Intern Hours
        </button>
      </Link>

      <h2>Intern OJT Hours</h2>

      {error && <p className="error">{error}</p>}

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* RESULTS */}
      <ul className="user-list">
        {filteredUsers.map((u) => (
          <li key={u.id} onClick={() => selectUser(u)}>
            {u.email}
          </li>
        ))}
      </ul>

      {/* SELECTED USER */}
      {selectedUser && (
        <div className="ojt-form">
          <p><strong>Email:</strong> {selectedUser.email}</p>

          <label>Total OJT Hours</label>
          <input
            type="number"
            min="1"
            value={totalOJTHours}
            onChange={(e) => setTotalOJTHours(e.target.value)}
          />

          <p>
            <strong>Remaining Hours:</strong>{" "}
            {remainingWorkHours.toFixed(2)}
          </p>

          <button onClick={saveOjtHours} disabled={loading}>
            {loading ? "Saving..." : "Save / Update"}
          </button>
        </div>
      )}
    </div>
  );
}
