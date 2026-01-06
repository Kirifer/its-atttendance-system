import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "../styles/UserInfoLayout.css";

function UserInfoLayout({ children }) {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const userMenuRef = useRef(null);
  const userProfileRef = useRef(null);

  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

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

  return (
    // Desktop-View
    <div className="userinfo">
      <aside className="userinfo__sidebar">
        <div className="userinfo__sidebar-header">
          <img src="its-logo.png" alt="logo" />
        </div>
        <ul className="userinfo__sidebar-links">
          <li>
            <a href="user-info">
              <span className="material-symbols-outlined">person</span>
              Profile
            </a>
          </li>
          <li>
            <a href="dashboard">
              <span className="material-symbols-outlined">dashboard</span>
              Return to Dashboard
            </a>
          </li>
          <li>
            <a onClick={handleSignOut}>
              <span className="material-symbols-outlined">logout</span>
              Sign Out
            </a>
          </li>
        </ul>
      </aside>

      {/* Mobile-View */}
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
            <a href="user-info">Profile</a>
          </li>
          <li className="navbar__item">
            <a href="dashboard">Return to Dashboard</a>
          </li>
          <li className="navbar__item">
            <a onClick={handleSignOut}>Sign Out</a>
          </li>
        </ul>
      </nav>

      <main className="userinfo__main">{children}</main>
    </div>
  );
}

export default UserInfoLayout;
