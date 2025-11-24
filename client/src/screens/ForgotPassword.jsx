import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ForgotPassword.css";
import API from "../api/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/forgot-password", { email });
      // show reset link if in DEV mode
      setMessage(res.data.resetUrl || res.data.message);
      if (res.data.resetUrl) {
        console.log("Password reset link:", res.data.resetUrl);
      }
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="background center-align-items">
      <form onSubmit={handleSubmit} class="forgot-password-box">
        <div className="top-box-header">
          <p class="forgot-password-text">Forgot Password</p>
          <button className="close-btn" onClick={() => navigate("/login")}>
            X
          </button>
        </div>

        {/* JSON */}
        {message && (
          <p style={{ wordBreak: "break-word", marginTop: "10px" }}>
            {message}
          </p>
        )}

        <div>
          <input
            class="text-box"
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
