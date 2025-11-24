import React, { useEffect } from "react";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import UserDropdownMenu from "./UserDropdownMenu";
import "../styles/DashboardLayout.css";

function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState({ username: "", email: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          username: decoded.user?.username || "",
          email: decoded.user?.email || "",
        });
      } catch (err) {
        console.error("Invalid token", err);
        if (storedUser) setUser(JSON.parse(storedUser));
        else setUser({ username: "", email: "" });
      }
    } else if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
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
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            style={{ cursor: "pointer" }}
          >
            <img src="defaultProfile.png" alt="profile" />
            <div className="dashboard__user-detail"></div>
            <h3>{user.username || "Guest"}</h3>
            <span>{user.email || "guest@exampple.com"}</span>
          </div>

          {userMenuOpen && <UserDropdownMenu />}
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