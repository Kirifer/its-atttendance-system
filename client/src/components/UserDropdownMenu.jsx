import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserDropdownMenu.css";

function UserDropDownMenu() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="user-dropdown">
      <ul>
        <li onClick={() => navigate("/user-info")}>Profile</li>
        <li onClick={handleSignOut}>Sign Out</li>
      </ul>
    </div>
  );
}

export default UserDropDownMenu;
