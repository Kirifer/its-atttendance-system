import React from "react";
import "../styles/DashboardLayout.css"
import { useState } from "react";

function DashboardLayout({ children }) {
   const [open, setOpen] = useState(false);

  return (
    <div className="dashboard">
      
      <aside className="dashboard__sidebar">
        <div className="dashboard__sidebar-header">
          <img src="its-logo.png" alt="logo"/>
        </div>
        <ul className="dashboard__sidebar-links">
          <li>
            <a href="dashboard">
              <span class="material-symbols-outlined">
                home
              </span>
              Dashboard
            </a>
          </li>
          <li>
            <a href="settings">
              <span class="material-symbols-outlined">
              settings
              </span>
              Settings
            </a>
          </li>
          <li>
            <a href="reports">
              <span class="material-symbols-outlined">
                home_storage
              </span>
              Reports
            </a>
          </li>
          <li>
            <a href="timesheet">
              <span class="material-symbols-outlined">
                calendar_month
              </span>
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
        <div className="dashboard__user-account">
          <div className="dashboard__user-profile">
            <img src="defaultProfile.png" alt="default profile"/>
            <div className="dashboard__user-detail"> 
              <h3>John Doe</h3>
              <span>Web Developer</span>
            </div>
          </div>
        </div>

      </aside>

      <nav className="navbar">

        <div className="navbar__logo">
          <img src="its-logo.png" alt="logo"/>
        </div>

        <button className="navbar__toggle" onClick={() => setOpen(!open)}>
          <span className="navbar__toggle-bar"></span>
          <span className="navbar__toggle-bar"></span>
          <span className="navbar__toggle-bar"></span>
        </button>


        <ul className={`navbar__menu ${open ? "navbar__menu--open" : ""}`}>
          <li className="navbar__item"><a href="dashboard">Dashboard</a></li>
          <li className="navbar__item"><a href="#">Settings</a></li>
          <li className="navbar__item"><a href="#">Reports</a></li>
          <li className="navbar__item"><a href="timesheet">Timesheet</a></li>
          <li className="navbar__item"><a href="#">Time-off</a></li>
        </ul>
      </nav>


      <main className="dashboard__main">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;