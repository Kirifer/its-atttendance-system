import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/ResetPassword.css";
import API from "../api/api";

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await API.post("/auth/reset-password", { token, password });
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="background center-align-items">
      <form onSubmit={handleReset} className="reset-password-box">
        <div className="top-box-header">
          <p className="reset-password-text">Reset Password</p>
          <button
            className="close-btn"
            onClick={() => navigate("/forgot-password")}
          >
            X
          </button>
        </div>

        {/* Message */}
        {message && <p>{message}</p>}

        <div>
          <input
            className="text-box"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />
        </div>

        <div>
          <input
            className="text-box"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
          />
        </div>

        {/* Buttons */}
        <button type="submit" className="reset-password-button">
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
