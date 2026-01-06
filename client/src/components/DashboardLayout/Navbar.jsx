import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const { user, setUser } = useContext(UserContext);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  if (!user) return null;

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
          <Link to="/dashboard">Dashboard</Link>
        </li>

        <li className="navbar__item">
          <Link to="/timesheet">Timesheet</Link>
        </li>

        <li className="navbar__item">
          <Link to="/time-off">Time-off</Link>
        </li>

        {user.role === "ADMIN" && (
          <li className="navbar__item">
            <Link to="/approvals">Approvals</Link>
          </li>
        )}
        <li className="navbar__item">
          <a href="/user-info">View Profile</a>
        </li>

        <li onClick={handleSignOut} className="navbar__item ">
          <span>Sign Out</span>
        </li>
      </ul>
    </nav>
  );
}
