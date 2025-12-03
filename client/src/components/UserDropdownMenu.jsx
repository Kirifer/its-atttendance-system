import React, { forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserDropdownMenu.css";

const UserDropDownMenu = forwardRef(({ pos }, ref) => {
  const navigate = useNavigate();

  const style = {
    position: "fixed",
    top: pos.y,
    left: pos.x,
    background: "white",
    border: "1px solid #ccc",
    borderRadius: "5px",
    zIndex: 9999,
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div ref={ref} style={style} className="user-dropdown">
      <ul>
        <li onClick={() => navigate("/user-info")}>View Profile</li>
        <li onClick={handleSignOut}>Sign Out</li>
      </ul>
    </div>
  );
});

export default UserDropDownMenu;
