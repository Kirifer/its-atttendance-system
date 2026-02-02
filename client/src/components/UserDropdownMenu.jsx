import React, { forwardRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import "../styles/UserDropdownMenu.css";

const UserDropDownMenu = forwardRef(({ pos, open }, ref) => {
  const navigate = useNavigate();

  const style = {
    position: "fixed",
    top: pos.y,
    left: pos.x,
    zIndex: 9999,
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return createPortal(
    <div
      ref={ref}
      style={style}
      className={`user-dropdown ${open ? "show" : ""}`}
    >
      <ul>
        <li onClick={() => navigate("/user-info")}>
          {" "}
          <span className="material-symbols-outlined">person</span>
          View Profile
        </li>
        <li onClick={handleSignOut}>
          <span className="material-symbols-outlined">logout</span>Sign Out
        </li>
      </ul>
    </div>,
    document.body,
  );
});

export default UserDropDownMenu;
