import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../api/auth";
import PasswordInput from "../components/PasswordInput";
import SuccessPopup from "../components/SuccessPopup";
import "../styles/ResetPassword.css";
import API from "../api/api";

function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setMessage("Passwords do not match!");
      setIsError(true);
      setTimeout(() => setIsError(""), 5000);
      return;
    }

    try {
      const res = await resetPassword(token, newPassword);
      setMessage(res.message);
      setIsError(false);
      setNewPassword("");
      setConfirmNewPassword("");
      setShowSuccessPopup(true);
    } catch (err) {
      console.error(err);
      setMessage(err.message || "An error occurred. Please try again.");
      setTimeout(() => setMessage(""), 5000);
      setIsError(true);
    }
  };

  return (
    <div className="background center-align-items">
      <form onSubmit={handleReset} className="reset-password-box">
        <div className="top-box-header">
          <p className="reset-password-text">Reset Password</p>
          <button
            type="button"
            className="close-btn"
            onClick={() => navigate("/forgot-password")}
          >
            X
          </button>
        </div>

        {/* Show error if passwords don't match */}
        {isError && (
          <p style={{ color: "red", marginTop: "10px" }}>
            Passwords do not match!
          </p>
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
            navigate("/login");
          }}
        />
      )}
    </div>
  );
}

export default ResetPassword;
