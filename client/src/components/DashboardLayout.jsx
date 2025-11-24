import React, { useEffect, useRef } from "react";
import { useState } from "react";
import UserDropdownMenu from "./UserDropdownMenu";
import "../styles/DashboardLayout.css";

function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState({ username: "", email: "" });
  const [dropdownPos, setDropdownPos] = useState({ x: 0, y: 0 });
  const userMenuRef = useRef(null);
  const userProfileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target) &&
        userProfileRef.current &&
        !userProfileRef.current.contains(event.target)
      ) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : { username: "", email: "" });
  }, []);

  return (
    <div className="dashboard">
      <aside className="dashboard__sidebar">
        <div className="dashboard__sidebar-header">
          <img src="its-logo.png" alt="logo" />
        </div>
        <ul className="dashboard__sidebar-links">
          <li>
            <a href="dashboard">
              <span class="material-symbols-outlined">home</span>
              Dashboard
            </a>
          </li>
          <li>
            <a href="settings">
              <span class="material-symbols-outlined">settings</span>
              Settings
            </a>
          </li>
          <li>
            <a href="reports">
              <span class="material-symbols-outlined">home_storage</span>
              Reports
            </a>
          </li>
          <li>
            <a href="timesheet">
              <span class="material-symbols-outlined">calendar_month</span>
              Timesheet
            </a>
          </li>
          <li>
            <a href="time-off">
              <span class="material-symbols-outlined">
                nest_clock_farsight_analog
              </span>
              Time-off
            </a>
          </li>
        </ul>

        {/* User */}
        <div className="dashboard__user-account">
          <div
            className="dashboard__user-profile"
            ref={userProfileRef}
            onClick={(e) => {
              setUserMenuOpen(!userMenuOpen);
              setDropdownPos({ x: e.clientX, y: e.clientY });
            }}
            style={{ cursor: "pointer" }}
          >
            <img src="defaultProfile.png" alt="profile" />
            <div className="dashboard__user-detail">
              <h3>{user.username || "Guest"}</h3>
              <h4>{user.email || "guest@exampple.com"}</h4>
            </div>
          </div>

          {userMenuOpen && (
            <UserDropdownMenu ref={userMenuRef} pos={dropdownPos} />
          )}
        </div>
      </aside>

      <nav className="navbar">
        <div className="navbar__logo">
          <img src="its-logo.png" alt="logo" />
        </div>

        <button className="navbar__toggle" onClick={() => setOpen(!open)}>
          <span className="navbar__toggle-bar"></span>
          <span className="navbar__toggle-bar"></span>
          <span className="navbar__toggle-bar"></span>
        </button>

        <ul className={`navbar__menu ${open ? "navbar__menu--open" : ""}`}>
          <li className="navbar__item">
            <a href="dashboard">Dashboard</a>
          </li>
          <li className="navbar__item">
            <a href="settings">Settings</a>
          </li>
          <li className="navbar__item">
            <a href="reports">Reports</a>
          </li>
          <li className="navbar__item">
            <a href="timesheet">Timesheet</a>
          </li>
          <li className="navbar__item">
            <a href="time-off">Time-off</a>
          </li>
        </ul>
      </nav>

      <main className="dashboard__main">{children}</main>
    </div>
  );
}

export default DashboardLayout;
