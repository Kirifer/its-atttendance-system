import { useEffect, useRef } from "react";
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

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const isAllSelected = selectedUsers.some((u) => u.id === "ALL");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSearching(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsSearching]);

  const handleContainerClick = () => {
    if (isAllSelected) return;
    inputRef.current?.focus();
    setIsSearching(true);
  };

  const handleSave = async () => {
    const ok = await saveOjtHours();
    if (ok) setTimeout(clearMessages, 5000);
  };

  return (
    <div className="ojt_desktop_container">
      <h2 className="ojt_title">Set Intern Hours</h2>
      {error && <p className="set_ojthours_error">{error}</p>}
      {success && <p className="set_ojthours_success">{success}</p>}

      <div className="ojt_horizontal_group">
        <div className="ojt_field user_list_wrapper" ref={dropdownRef}>
          <label className="field_label">Intern Emails</label>
          <div
            className={`user_chip_container ${isAllSelected ? "locked" : ""}`}
            onClick={handleContainerClick}
          >
            {selectedUsers.map((u) => (
              <div
                key={u.id}
                className={`user_chip ${u.id === "ALL" ? "all_chip" : ""}`}
              >
                {u.id === "ALL" ? "ALL USERS" : u.email}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeUser(u.id);
                  }}
                  aria-label={`Remove ${u.id === "ALL" ? "ALL USERS" : u.email}`}
                >
                  &times;
                </button>
              </div>
            ))}
            <input
              ref={inputRef}
              type="text"
              className="user_search_input"
              readOnly={isAllSelected}
              placeholder={selectedUsers.length === 0 ? "Search emails..." : ""}
              value={search}
              onFocus={() => !isAllSelected && setIsSearching(true)}
              onChange={(e) => {
                setSearch(e.target.value);
                setIsSearching(true);
              }}
            />
          </div>

          {isSearching && !isAllSelected && (
            <div className="user_dropdown">
              <div
                className="user_dropdown_item all_option"
                onClick={() => selectUser({ id: "ALL", email: "ALL USERS" })}
              >
                <strong>ALL USERS</strong>
              </div>
              {filteredUsers.length > 0 && (
                <>
                  {filteredUsers.map((u) => (
                    <div
                      key={u.id}
                      className="user_dropdown_item"
                      onClick={() => selectUser(u)}
                    >
                      {u.email}
                    </div>
                  ))}
                </>
              )}
              {search.length > 0 && filteredUsers.length === 0 && (
                <div className="user_no_results">
                  No users found for "{search}"
                </div>
              )}
            </div>
          )}
        </div>

        <div className="ojt_field">
          <label className="field_label">Total OJT Hours</label>
          <input
            type="number"
            min="1"
            placeholder="Enter Total OJT Hours"
            value={totalOJTHours}
            onChange={(e) => setTotalOJTHours(e.target.value)}
            disabled={selectedUsers.length === 0 || loading}
          />
        </div>

        <div className="ojt_field readonly">
          <label className="field_label">Remaining Hours</label>
          <input
            type="text"
            value={
              selectedUsers.length === 1 && !isAllSelected
                ? remainingWorkHours.toFixed(2)
                : "-"
            }
            disabled
          />
        </div>

        <div className="ojt_field action">
          <label className="field_label">&nbsp;</label>
          <button
            className="ojt_save_btn"
            onClick={handleSave}
            disabled={selectedUsers.length === 0 || !totalOJTHours || loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
