import React, { useState, useEffect } from "react";
import { changePassword } from "../api/auth";
import UserInfoLayout from "../components/UserInfoLayout";
import "../styles/PasswordChange.css";
import API from "../api/api";

const UserInfo = () => {
  const [user, setUser] = useState(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        console.log("ERROR LOADING USER:", err);
      }
    };
    getUser();
  }, []);

  const handleChange = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match!");
    }

    try {
      await changePassword(oldPassword, newPassword);
      setMsg("Password has been updated!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Error in updating password.");
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <UserInfoLayout>
      <div className="user-info-container">
        <h2>User Info</h2>

        <p>
          <strong>Username:</strong> {user.username}
        </p>

        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <p>
          <strong>Role:</strong> {user.role}
        </p>

        {user.profilePic && (
          <img
            src={`http://localhost:5001/uploads/${user.profilePic}`}
            alt="Profile"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              marginTop: "10px",
              objectFit: "cover",
            }}
          />
        )}

        <h3 style={{ marginTop: "30px" }}>Change Password</h3>
        {/* Error msg */}
        {msg && <p style={{ color: "green" }}>{msg}</p>}
        {error && <p className="uc-error-text">{error}</p>}

        <form onSubmit={handleChange} className="change-password-form">
          <div className="uc-password-wrapper">
            <div className="uc-input-group">
              <input
                type={showOld ? "text" : "password"}
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="uc-password-input"
              />
              <span
                className="uc-eye-icon material-symbols-outlined"
                onClick={() => setShowOld(!showOld)}
              >
                {showOld ? "visibility" : "visibility_off"}
              </span>
            </div>
          </div>

          <div className="uc-password-wrapper">
            <div className="uc-input-group">
              <input
                type={showNew ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="uc-password-input"
              />
              <span
                className="uc-eye-icon material-symbols-outlined"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? "visibility" : "visibility_off"}
              </span>
            </div>
          </div>

          <div className="uc-password-wrapper">
            <div className="uc-input-group">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="uc-password-input"
              />
              <span
                className="uc-new-eye-icon material-symbols-outlined"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? "visibility" : "visibility_off"}
              </span>
            </div>
          </div>

          <button type="submit">Update Password</button>
        </form>
      </div>
    </UserInfoLayout>
  );
};

export default UserInfo;
