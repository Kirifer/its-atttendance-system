import { useState } from "react";

export default function Navbar({ user }) {
  const [open, setOpen] = useState(false);

  return (
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
          <a href="/dashboard">Dashboard</a>
        </li>

        <li className="navbar__item">
          <a href="/settings">Settings</a>
        </li>

        <li className="navbar__item">
          <a href="/timesheet">Timesheet</a>
        </li>

        <li className="navbar__item">
          <a href="/time-off">Time-off</a>
        </li>

        {user.role === "ADMIN" && (
          <li className="navbar__item">
            <a href="/time-off-admin">Admin</a>
          </li>
        )}
        <li className="navbar__item">
          <a href="/user-info">Profile</a>
        </li>
      </ul>
    </nav>
  );
}
