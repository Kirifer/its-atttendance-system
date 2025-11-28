import React, { useState, useEffect } from "react";
// change pass
import { changePassword } from "../api/auth";
// user info update
import { updateUserInfo } from "../api/auth";
import UserInfoLayout from "../components/UserInfoLayout";
import "../styles/UserInfo.css";
import "../styles/PasswordChange.css";
import API from "../api/api";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";

const UserInfo = () => {
  const [user, setUser] = useState(null);

  // real-time update
  const { user: contextUser, setUser: setContextUser } =
    useContext(UserContext);

  // Edit state
  const [editUsername, setEditUsername] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  // change pass
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // error messages
  const [usernameMsg, setUsernameMsg] = useState("");
  const [usernameErr, setUsernameErr] = useState("");

  const [emailMsg, setEmailMsg] = useState("");
  const [emailErr, setEmailErr] = useState("");

  const [passMsg, setPassMsg] = useState("");
  const [passErr, setPassErr] = useState("");

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

  // change pass
  const handleChange = async (e) => {
    e.preventDefault();
    setPassMsg("");
    setPassErr("");

    if (newPassword !== confirmPassword) {
      setPassErr("Passwords do not match!");
      setTimeout(() => setPassErr(""), 5000);
      return;
    }

    if (oldPassword === newPassword) {
      setPassMsg(
        "New password is the same with the old password. No changes were made."
      );
      setTimeout(() => setPassMsg(""), 5000);
      return;
    }

    try {
      await changePassword(oldPassword, newPassword);
      setPassMsg("Password has been updated!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setEditPassword(false);
      setTimeout(() => setPassMsg(""), 5000);
    } catch (err) {
      setPassErr(err.response?.data?.message || "Error in updating password.");
      setTimeout(() => setPassErr(""), 5000);
    }
  };
  // change pass

  // user info update
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data);
        setUsername(res.data.username);
        setEmail(res.data.email);
      } catch (err) {
        console.log("ERROR LOADING USER:", err);
      }
    };
    getUser();
  }, []);

  // username update
  const handleUsernameUpdate = async (e) => {
    e.preventDefault();
    setUsernameMsg("");
    setUsernameErr("");

    if (username === user.username) {
      setUsernameMsg("Username is the same as before. No were changes made.");
      setTimeout(() => setUsernameMsg(""), 5000);
      return;
    }

    try {
      const updated = await updateUserInfo(username, email);
      setUser(updated);
      setContextUser(updated);
      setUsernameMsg("Username updated successfully!");
      setEditUsername(false); // only close on success

      setTimeout(() => setUsernameMsg(""), 5000);
    } catch (err) {
      setUsernameErr(err.response?.data?.message || "Username already exists!");
      setTimeout(() => setUsernameErr(""), 5000);
    }
  };

  // email update
  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    setEmailMsg("");
    setEmailErr("");

    if (email === user.email) {
      setEmailMsg("Email is the same as before. No were changes made.");
      setTimeout(() => setEmailMsg(""), 5000);
      return;
    }

    try {
      const updated = await updateUserInfo(username, email);
      setUser(updated);
      setContextUser(updated);
      setEmailMsg("Email updated successfully!");
      setEditEmail(false); // only close on success

      setTimeout(() => setEmailMsg(""), 5000);
    } catch (err) {
      setEmailErr(err.response?.data?.message || "Email already exists!");
      setTimeout(() => setEmailErr(""), 5000);
    }
  };
  // user info update

  // fetch user
  if (!user) return <div>Loading...</div>;

  return (
    <UserInfoLayout>
      <div className="user-info-container">
        <h2>User Info</h2>

        {/* PFP */}
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

        {/* USER INFO */}
        {/* Username/Email Update */}

        {/* username */}
        {usernameMsg && <p style={{ color: "green" }}>{usernameMsg}</p>}
        {usernameErr && <p style={{ color: "red" }}>{usernameErr}</p>}

        <form onSubmit={handleUsernameUpdate} className="update-user-form">
          <h3>Username:</h3>
          <div className="uc-input-group ">
            <input
              className="text-box"
              type="text"
              placeholder="Username"
              value={username}
              disabled={!editUsername}
              onChange={(e) => setUsername(e.target.value)}
            />

            {!editUsername && (
              <span
                className="material-symbols-outlined edit-icon"
                onClick={() => setEditUsername(true)}
              >
                edit
              </span>
            )}
          </div>

          {editUsername && (
            <div className="password-buttons">
              <button className="change-password-form-button" type="submit">
                Done
              </button>

              <button
                className="change-password-form-button"
                type="button"
                onClick={() => {
                  setEditUsername(false);
                  setUsername(user.username);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </form>

        {/* email */}
        {emailMsg && <p style={{ color: "green" }}>{emailMsg}</p>}
        {emailErr && <p style={{ color: "red" }}>{emailErr}</p>}

        <form onSubmit={handleEmailUpdate} className="update-user-form">
          <h3>Email:</h3>
          <div className="uc-input-group">
            <input
              className="text-box"
              type="email"
              placeholder="Email"
              value={email}
              disabled={!editEmail}
              onChange={(e) => setEmail(e.target.value)}
            />

            {!editEmail && (
              <span
                className="material-symbols-outlined edit-icon"
                onClick={() => setEditEmail(true)}
              >
                edit
              </span>
            )}
          </div>

          {editEmail && (
            <div className="password-buttons">
              <button className="change-password-form-button" type="submit">
                Done
              </button>

              <button
                className="change-password-form-button"
                type="button"
                onClick={() => {
                  setEditEmail(false);
                  setEmail(user.email);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </form>

        {/* password */}
        {passMsg && <p style={{ color: "green" }}>{passMsg}</p>}
        {passErr && <p style={{ color: "red" }}>{passErr}</p>}

        <h3>Change Password:</h3>
        <form onSubmit={handleChange}>
          {!editPassword ? (
            // Password placeholder
            <div className="uc-input-group">
              <input
                type="password"
                placeholder="***************"
                disabled
                className="uc-password-input"
              />
              <span
                className="material-symbols-outlined edit-icon"
                style={{ cursor: "pointer" }}
                onClick={() => setEditPassword(true)}
              >
                edit
              </span>
            </div>
          ) : (
            // Actual password fields
            <>
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

              <div className="uc-input-group">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="uc-password-input"
                />
                <span
                  className="uc-eye-icon material-symbols-outlined"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? "visibility" : "visibility_off"}
                </span>
              </div>

              <div className="password-buttons">
                <button className="change-password-form-button" type="submit">
                  Done
                </button>
                <button
                  className="change-password-form-button"
                  type="button"
                  onClick={() => {
                    setEditPassword(false);
                    setOldPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setPassErr("");
                    setPassMsg("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </UserInfoLayout>
  );
};

export default UserInfo;
