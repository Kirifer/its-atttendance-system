import { useEffect, useRef, useState } from "react";
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
    removeUser,
    selectedUsers,
    totalOJTHours,
    setTotalOJTHours,
    remainingWorkHours,
    saveOjtHours,
    resetState,
    clearMessages,
    loading,
    error,
    success,
  } = useHandleOjtHours();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isAllSelected = selectedUsers.some((u) => u.id === "ALL");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSearching(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, setIsSearching]);

  const handleClose = () => {
    resetState();
    setOpen(false);
  };

  const handleSave = async () => {
    const ok = await saveOjtHours();
    if (ok) setTimeout(clearMessages, 3000);
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

            <label>Intern Emails</label>
            <div className="set_ojthours_search_wrapper" ref={dropdownRef}>
              <div className="user_chip_container_mobile">
                {selectedUsers.map((u) => (
                  <div
                    key={u.id}
                    className={`user_chip ${u.id === "ALL" ? "all_chip" : ""}`}
                  >
                    {u.id === "ALL" ? "ALL USERS" : u.email}
                    <button
                      type="button"
                      onClick={() => removeUser(u.id)}
                      aria-label={`Remove ${u.id === "ALL" ? "ALL USERS" : u.email}`}
                    >
                      &times;
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  placeholder={
                    selectedUsers.length === 0 ? "Search emails..." : ""
                  }
                  value={search}
                  readOnly={isAllSelected}
                  onFocus={() => !isAllSelected && setIsSearching(true)}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setIsSearching(true);
                  }}
                />
              </div>

              {isSearching && !isAllSelected && (
                <ul className="set_ojthours_user_list-mobile">
                  <li
                    className="all_option"
                    onClick={() =>
                      selectUser({ id: "ALL", email: "ALL USERS" })
                    }
                  >
                    <strong>ALL USERS</strong>
                  </li>
                  {filteredUsers.length > 0 && (
                    <>
                      {filteredUsers.map((u) => (
                        <li key={u.id} onClick={() => selectUser(u)}>
                          {u.email}
                        </li>
                      ))}
                    </>
                  )}
                  {search.length > 0 && filteredUsers.length === 0 && (
                    <li className="no_results">
                      No users found for "{search}"
                    </li>
                  )}
                </ul>
              )}
            </div>

            <label>Total OJT Hours</label>
            <input
              type="number"
              min="1"
              placeholder="Enter Total OJT Hours"
              value={totalOJTHours}
              onChange={(e) => setTotalOJTHours(e.target.value)}
              disabled={selectedUsers.length === 0 || loading}
            />

            <p className="set_ojthours_remaining">
              <strong>Remaining Hours:</strong>{" "}
              {selectedUsers.length === 1 && !isAllSelected
                ? remainingWorkHours.toFixed(2)
                : "-"}
            </p>

            <div className="set_ojthours_buttons">
              <button
                onClick={handleSave}
                disabled={
                  selectedUsers.length === 0 || !totalOJTHours || loading
                }
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button onClick={handleClose}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
