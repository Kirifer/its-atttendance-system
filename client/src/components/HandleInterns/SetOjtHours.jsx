import { useState } from "react";
import useHandleOjtHours from "../../hooks/handleOjtHours";
import "../../styles/HandleInterns/SetOjtHours.css";

export default function SetOjtHours() {
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

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    resetState();
    setOpen(false);
  };

  const handleSave = async () => {
    const ok = await saveOjtHours();
    if (!ok) return;

    setTimeout(() => {
      handleClose();
    }, 5000);
  };

  return (
    <>
      <button className="set_ojthours_btn" onClick={() => setOpen(true)}>
        Set Intern Hours
      </button>

      {open && (
        <div className="set_ojthours_overlay">
          <div className="set_ojthours_popup">
            <div className="set_ojthours_header">
              <h2>Set Intern Hours</h2>
            </div>

            {error && <p className="set_ojthours_error">{error}</p>}
            {success && <p className="set_ojthours_success">{success}</p>}

            <label>Intern Email</label>
            <div className="set_ojthours_search_wrapper">
              <input
                type="text"
                placeholder="Search by email"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setIsSearching(true)
                }}
              />

              {filteredUsers.length > 0 && (
                <ul className="set_ojthours_user_list-mobile">
                  {filteredUsers.map((u) => (
                    <li
                      key={u.id}
                      onClick={(e) => {
                        e.preventDefault();
                        selectUser(u);
                        setSearch(u.email);
                      }}
                    >
                      {u.email}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <label>Total OJT Hours</label>
            <input
              type="number"
              min="1"
              value={totalOJTHours}
              onChange={(e) => setTotalOJTHours(e.target.value)}
              disabled={!selectedUser || loading}
              onFocus={() => setIsSearching(false)}
            />

            <p className="set_ojthours_remaining">
              <strong>Remaining Hours:</strong>{" "}
              {selectedUser ? remainingWorkHours.toFixed(2) : "-"}
            </p>

            <div className="set_ojthours_buttons">
              <button onClick={handleSave} disabled={loading || !selectedUser}>
                {loading ? "Saving" : "Save"}
              </button>
              <button onClick={handleClose}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
