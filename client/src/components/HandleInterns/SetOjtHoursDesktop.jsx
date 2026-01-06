import useHandleOjtHours from "../../hooks/handleOjtHours";
import "../../styles/HandleInterns/SetOjtHoursDesktop.css";

export default function SetOJTHoursDesktop() {
  const {
    search,
    setSearch,
    isSearching,
    setIsSearching,
    filteredUsers,
    selectUser,
    selectedUser,
    totalOJTHours,
    setTotalOJTHours,
    remainingWorkHours,
    saveOjtHours,
    resetState,
    loading,
    error,
    success,
  } = useHandleOjtHours();

  const handleSave = async () => {
    const ok = await saveOjtHours();
    if (!ok) return;
    setTimeout(resetState, 5000);
  };

  return (
    <div className="ojt_desktop_container">
      <h2 className="ojt_title">Set Intern Hours</h2>

      {error && <p className="set_ojthours_error">{error}</p>}
      {success && <p className="set_ojthours_success">{success}</p>}

      <div className="ojt_horizontal_group">
        {/* EMAIL */}
        <div className="ojt_field email">
          <label>Intern Email</label>
          <input
            type="text"
            placeholder="Search by email"
            value={search}
            onFocus={() => setIsSearching(true)}
            onChange={(e) => {
              setSearch(e.target.value);
              setIsSearching(true);
            }}
          />

          {isSearching && filteredUsers.length > 0 && (
            <ul className="set_ojthours_user_list">
              {filteredUsers.map((u) => (
                <li
                  key={u.id}
                  onClick={() => {
                    selectUser(u);
                    setSearch(u.email);
                    setIsSearching(false);
                  }}
                >
                  {u.email}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* TOTAL HOURS */}
        <div className="ojt_field">
          <label>Total OJT Hours</label>
          <input
            type="number"
            min="1"
            value={totalOJTHours}
            onChange={(e) => setTotalOJTHours(e.target.value)}
            disabled={!selectedUser || loading}
          />
        </div>

        {/* REMAINING */}
        <div className="ojt_field readonly">
          <label>Remaining Hours</label>
          <input
            type="text"
            value={selectedUser ? remainingWorkHours.toFixed(2) : "-"}
            disabled
          />
        </div>

        {/* SAVE */}
        <div className="ojt_field action">
          <label>&nbsp;</label>
          <button
            className="ojt_save_btn"
            onClick={handleSave}
            disabled={!selectedUser || loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
