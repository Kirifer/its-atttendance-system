import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../api/auth";
import PasswordInput from "../components/PasswordInput";
import SuccessPopup from "../components/SuccessPopup";
import "../styles/ResetPassword.css";
import Loader from "../components/Loader";
import API from "../api/api";

function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmNewPassword) {
      setMessage("Passwords do not match!");
      setIsError(true);
      setLoading(false);
      setTimeout(() => setIsError(false), 5000);
      return;
    }

    try {
      // Send all three fields exactly
      const res = await API.post("/auth/reset-password", {
        token,
        newPassword,
        confirmNewPassword,
      });

      setMessage(res.message || "Password reset successful!");
      setIsError(false);
      setNewPassword("");
      setConfirmNewPassword("");
      setShowSuccessPopup(true);

      sessionStorage.removeItem("reset_allowed");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || err.message || "Server Error");
      setIsError(true);
      setTimeout(() => setIsError(false), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-background">
      {loading && <Loader />}
      <form onSubmit={handleReset} className="reset-password-box">
        <div className="top-box-header">
          <p className="reset-password-text">
            Please enter a new password to secure your account.
          </p>
          <button
            type="button"
            className="close-btn"
            onClick={() => navigate("/forgot-password")}
          >
            X
          </button>
        </div>

        {/* Show message if error */}
        {message && isError && (
          <p style={{ color: "red", marginTop: "10px" }}>{message}</p>
        )}

        {/* Password input */}
        <PasswordInput
          newPassword={newPassword}
          confirmNewPassword={confirmNewPassword}
          onNewChange={(e) => setNewPassword(e.target.value)}
          onConfirmNewChange={(e) => setConfirmNewPassword(e.target.value)}
          showNew={true}
        />

        {/* Submit button */}
        <button type="submit" className="reset-password-button">
          Reset Password
        </button>
      </form>

      {/* Success popup */}
      {showSuccessPopup && (
        <SuccessPopup
          message="Reset password successful! You can now proceed to log in."
          onClose={() => {
            setShowSuccessPopup(false);
            navigate("/");
          }}
        />
      )}
    </div>
  );
}

export default ResetPassword;
