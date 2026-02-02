import { useState, useEffect, useContext } from "react"; // combined imports
import { changePassword, updateUserInfo } from "../api/auth";
import "../styles/UserInfo.css";
import "../styles/PasswordChange.css";
import API from "../api/api";
import { UserContext } from "../context/UserContext";
import UserTotalOJTHours from "../components/UserTotalOJTHours";
import DashboardLayout from "../components/DashboardLayout";
import UserInfoLoader from "../components/UserInfoLoader";

const UserInfo = () => {
  const [user, setUser] = useState(null); // real-time update
  const { user: contextUser, setUser: setContextUser } =
    useContext(UserContext);

  // Edit state
  const [editUsername, setEditUsername] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  // Change password
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Error messages
  const [usernameMsg, setUsernameMsg] = useState("");
  const [usernameErr, setUsernameErr] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [passErr, setPassErr] = useState("");

  // User info state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  // loader
  const [loading, setLoading] = useState(false);

  // Fetch user data
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

  // Change password handler
  const handleChange = async (e) => {
    e.preventDefault();
    setPassMsg("");
    setPassErr("");
    setLoading(true);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPassErr("Please fill out all fields!");
      setTimeout(() => setPassErr(""), 5000);
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassErr("Passwords do not match!");
      setTimeout(() => setPassErr(""), 5000);
      setLoading(false);
      return;
    }
    if (oldPassword === newPassword) {
      setPassMsg(
        "New password is the same as the old password. No changes were made.",
      );
      setTimeout(() => setPassMsg(""), 5000);
      setLoading(false);
      return;
    }

    try {
      await changePassword(oldPassword, newPassword, confirmPassword);
      setPassMsg("Password has been updated!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setEditPassword(false);
      setTimeout(() => setPassMsg(""), 5000);
    } catch (err) {
      setPassErr(err.message);
      setTimeout(() => setPassErr(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Username update handler
  const handleUsernameUpdate = async (e) => {
    e.preventDefault();
    setUsernameMsg("");
    setUsernameErr("");
    setLoading(true);

    if (username.length < 3) {
      setUsernameErr("Username must be at least 3 characters long.");
      setTimeout(() => setUsernameErr(""), 5000);
      setLoading(false);
      return;
    }
    if (username === user.username) {
      setUsernameMsg("Username is the same as before. No changes were made.");
      setTimeout(() => setUsernameMsg(""), 5000);
      setLoading(false);
      return;
    }

    try {
      const updated = await updateUserInfo(username, email);
      setUser(updated);
      setContextUser(updated);
      setUsernameMsg("Username updated successfully!");
      setEditUsername(false);
      setTimeout(() => setUsernameMsg(""), 5000);
    } catch (err) {
      setUsernameErr(err.response?.data?.message || "Username already exists!");
      setTimeout(() => setUsernameErr(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Email update handler
  const emailRegex =
    /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9-]{2,}(\.[a-zA-Z]{2,6})+$/;
  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    setEmailMsg("");
    setEmailErr("");
    setLoading(true);

    if (!emailRegex.test(email)) {
      setEmailErr(
        "Invalid email format. Must be at least 3 characters and have a valid domain.",
      );
      setTimeout(() => setEmailErr(""), 5000);
      setLoading(false);
      return;
    }
    if (email === user.email) {
      setEmailMsg("Email is the same as before. No changes were made.");
      setTimeout(() => setEmailMsg(""), 5000);
      setLoading(false);
      return;
    }

    try {
      const updated = await updateUserInfo(username, email);
      setUser(updated);
      setContextUser(updated);
      setEmailMsg("Email updated successfully!");
      setEditEmail(false);
      setTimeout(() => setEmailMsg(""), 5000);
    } catch (err) {
      setEmailErr(err.response?.data?.message || "Email already exists!");
      setTimeout(() => setEmailErr(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <UserInfoLoader />;

  return (
    <DashboardLayout>
      {loading && <UserInfoLoader />}
      <div className="user-info-container">
        <h2>User Info</h2>
        {/* PFP */}
        {user.profilePic && (
          <img
            src={
              user.profilePic?.startsWith("http")
                ? user.profilePic
                : `${
                    process.env.REACT_APP_BACKEND_URL || "http://localhost:5001"
                  }/uploads/${user.profilePic}`
            }
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

        {/* User's Total OJT Hours */}
        <UserTotalOJTHours />

        {/* Username */}
        {usernameMsg && <p style={{ color: "green" }}>{usernameMsg}</p>}
        {usernameErr && <p style={{ color: "red" }}>{usernameErr}</p>}
        <form onSubmit={handleUsernameUpdate} className="update-user-form">
          <h3>Username:</h3>
          <div className="uc-input-group">
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

        {/* Email */}
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

        {/* Password */}
        {passMsg && <p style={{ color: "green" }}>{passMsg}</p>}
        {passErr && <p style={{ color: "red" }}>{passErr}</p>}
        <h3>Change Password:</h3>
        <form onSubmit={handleChange}>
          {!editPassword ? (
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
    </DashboardLayout>
  );
};

export default UserInfo;
