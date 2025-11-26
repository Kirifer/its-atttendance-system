import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../api/auth";
import "../styles/ForgotPassword.css";
import API from "../api/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword(email); // use service function
      setMessage(res.resetUrl || res.message); // DEV mode shows reset link
      setIsError(false);
      if (res.resetUrl) {
        console.log("Password reset link:", res.resetUrl);
      }
    } catch (err) {
      console.error(err);
      setMessage(err.message || "An error occurred. Please try again.");
      setIsError(true);
    }
  };

  return (
    <div className="background center-align-items">
      <form onSubmit={handleSubmit} className="forgot-password-box">
        <div className="top-box-header">
          <p className="forgot-password-text">Forgot Password</p>
          <button
            type="button"
            className="close-btn"
            onClick={() => navigate("/login")}
          >
            X
          </button>
        </div>

        {/* JSON */}
        {message && (
          <p
            style={{
              wordBreak: "break-word",
              marginTop: "10px",
              color: isError ? "red" : "green",
            }}
          >
            {message.includes("reset-password") ? (
              <a href={message}>{message}</a>
            ) : (
              message
            )}
          </p>
        )}

        <div>
          <input
            className="text-box"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Buttons */}
        <button type="submit" className="forgot-password-button">
          Submit
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
