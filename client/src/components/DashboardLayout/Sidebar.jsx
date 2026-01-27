import { useEffect, useState, useRef, useContext } from "react";
import UserDropDownMenu from "../UserDropdownMenu";
import { NavLink } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import "../../styles/SidebarLoader.css";

export default function Sidebar() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ x: 0, y: 0 });

  const userMenuRef = useRef(null);
  const userProfileRef = useRef(null);

  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) setLoading(false);
  }, [user]);

  // Load saved state
  useEffect(() => {
    const saved = localStorage.getItem("sidebarExpanded");
    if (saved !== null) setSidebarExpanded(saved === "true");
  }, []);

  // Save state
  useEffect(() => {
    localStorage.setItem("sidebarExpanded", sidebarExpanded);
  }, [sidebarExpanded]);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target) &&
        userProfileRef.current &&
        !userProfileRef.current.contains(e.target)
      ) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading)
    return (
      <aside
        className={`dashboard__sidebar ${sidebarExpanded ? "expanded" : "collapsed"}`}
      >
        <div className="sidebar-loading">
          <div className="sidebar-spinner"></div>
        </div>
      </aside>
    );

  if (!user) return null;

  return (
    <aside
      className={`dashboard__sidebar ${
        sidebarExpanded ? "expanded" : "collapsed"
      }`}
      onMouseEnter={() => setSidebarExpanded(true)}
      onMouseLeave={() => setSidebarExpanded(false)}
    >
      <div className="dashboard__sidebar-header">
        <img src="its-logo.png" alt="logo" />
      </div>

      <ul className="dashboard__sidebar-links">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "active-link" : undefined)}
          >
            <span className="material-symbols-outlined">home</span>
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/timesheet"
            className={({ isActive }) => (isActive ? "active-link" : undefined)}
          >
            <span className="material-symbols-outlined">calendar_month</span>
            Timesheet
          </NavLink>
        </li>

        {user.role === "USER" && (
          <li>
            <NavLink
              to="/time-off"
              className={({ isActive }) =>
                isActive ? "active-link" : undefined
              }
            >
              <span className="material-symbols-outlined">
                nest_clock_farsight_analog
              </span>
              Time-off
            </NavLink>
          </li>
        )}

        {/* {user.role === "ADMIN" && (
          <li>
            <NavLink
              to="/time-off-admin"
              className={({ isActive }) =>
                isActive ? "active-link" : undefined
              }
            >
              <span className="material-symbols-outlined">manage_accounts</span>
              Time-off Admin
            </NavLink>
          </li>
        )} */}

        {user.role === "ADMIN" && (
          <li>
            <NavLink
              to="/approvals"
              className={({ isActive }) =>
                isActive ? "active-link" : undefined
              }
            >
              <span className="material-symbols-outlined">
                person_raised_hand
              </span>
              Approvals
            </NavLink>
          </li>
        )}
      </ul>

      {/* User section */}
      <div
        className={`dashboard__user-account ${userMenuOpen ? "menu-open" : ""}`}
      >
        <div
          ref={userProfileRef}
          className="dashboard__user-profile"
          onClick={(e) => {
            setUserMenuOpen(!userMenuOpen);
            setDropdownPos({ x: e.clientX, y: e.clientY });
          }}
        >
          <img
            src="defaultProfile.png"
            alt="profile"
            style={{ cursor: "pointer" }}
          />
          <div className="dashboard__user-detail" style={{ cursor: "pointer" }}>
            <h3>{user.username}</h3>
            <h4>{user.email}</h4>
          </div>
        </div>

        <UserDropDownMenu
          ref={userMenuRef}
          pos={dropdownPos}
          open={userMenuOpen}
        />
      </div>
    </aside>
  );
}
