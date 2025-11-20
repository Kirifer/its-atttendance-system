import React from "react";
import "./DashboardLayout.css";

function DashboardLayout({ children }) {
  return (
    <div className="dashboard">
      
      <aside className="dashboard__sidebar">
        <div className="dashboard__sidebar-header">
          <img src="its-logo.png" alt="logo"/>
        </div>
        <ul className="dashboard__sidebar-links">
          <li>
            <a href="#">
              <span class="material-symbols-outlined">
                home
              </span>
              Dashboard
            </a>
          </li>
          <li>
            <a href="#">
              <span class="material-symbols-outlined">
              settings
              </span>
              Settings
            </a>
          </li>
          <li>
            <a href="#">
              <span class="material-symbols-outlined">
                home_storage
              </span>
              Reports
            </a>
          </li>
          <li>
            <a href="#">
              <span class="material-symbols-outlined">
                calendar_month
              </span>
              Timesheet
            </a>
          </li>
          <li>
            <a href="#">
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


      <main className="dashboard__main">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
